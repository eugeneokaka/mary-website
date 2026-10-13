import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins/email-otp";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import authConfig from "./auth.config";
import { sendOtpEmail } from "./email";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

// Comma-separated list of Google/email addresses allowed to manage content.
function allowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return allowedEmails().includes(email.toLowerCase());
}

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    baseURL: siteUrl,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: [
      "http://localhost:3000",
      "https://oasiswellnessconsultancy.com",
      "https://www.oasiswellnessconsultancy.com",
    ],
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
    // Reject non-allowlisted emails before any email is sent or any OTP is stored.
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/email-otp/send-verification-otp") {
          const email = (ctx.body as { email?: string } | undefined)?.email;
          if (!isAllowedEmail(email)) {
            throw new APIError("FORBIDDEN", { message: "You are not authorised" });
          }
        }
      }),
    },
    // Reject non-allowlisted emails before a user row is created (e.g. Google sign-in).
    databaseHooks: {
      user: {
        create: {
          before: async (user: { email: string }) => {
            if (!isAllowedEmail(user.email)) {
              throw new APIError("FORBIDDEN", { message: "You are not authorised" });
            }
            return { data: user };
          },
        },
      },
    },
    plugins: [
      convex({ authConfig }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp }) {
          await sendOtpEmail(email, otp);
        },
      }),
    ],
  };
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth(createAuthOptions(ctx));

// Tells the client who is signed in and whether they are authorised.
// Returns null when nobody is signed in.
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const email = identity.email?.toLowerCase() ?? null;
    return { email, authorized: isAllowedEmail(email) };
  },
});

// Server-side authorization guard for content management functions.
export async function requireAuthor(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  if (!isAllowedEmail(identity.email)) {
    throw new Error("You are not authorised");
  }

  return identity;
}
