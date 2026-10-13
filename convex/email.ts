import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const from =
  process.env.EMAIL_FROM ?? "Oasis Wellness <onboarding@resend.dev>";

export async function sendOtpEmail(to: string, otp: string) {
  await resend.emails.send({
    from,
    to,
    subject: `Your sign-in code: ${otp}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Your sign-in code</h2>
        <p>Enter this code to sign in to Oasis Wellness Consultancy:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 5 minutes. If you didn't request it, you can safely ignore this email.</p>
      </div>
    `,
  });
}
