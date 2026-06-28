import { mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const signUp = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the username is already taken
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      throw new Error("Username already taken");
    }

    // Hash the password synchronously because Convex mutations don't support setTimeout
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(args.password, saltRounds);

    // Insert the new user
    const userId = await ctx.db.insert("users", {
      username: args.username,
      password: hashedPassword,
    });

    return {
      success: true,
      userId,
      message: "User created successfully",
    };
  },
});

export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(args.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    // Create JWT token
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "my-super-secret-fallback-key-12345"
    );
    
    const token = await new SignJWT({ userId: user._id, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // Token valid for 7 days
      .sign(secretKey);

    return {
      success: true,
      token,
      userId: user._id,
      username: user.username
    };
  },
});

export async function verifyToken(token: string) {
  try {
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "my-super-secret-fallback-key-12345"
    );
    const { payload } = await jwtVerify(token, secretKey);
    return payload; // Contains userId and username
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
