// pages/api/auth/send-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend("re_K4k8eGrN_7KjdjQ4cGvEjWmJEiUyPjKbv"); // 🔑 Your Resend API Key
const fixedEmail = "saransrini37@gmail.com"; // 🔒 OTP will always be sent here

// In-memory OTP storage
let otpStore: { [key: string]: { otp: string; expires: number } } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore[fixedEmail] = { otp, expires };

  try {
    await resend.emails.send({
      from: "ProjectMate <onboarding@resend.dev>",
      to: fixedEmail,
      subject: "🔐 ProjectMate OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f8f9fa; padding:20px; border-radius:8px; max-width:400px; margin:auto;">
          <h2 style="color:#6A0DAD; text-align:center;">ProjectMate</h2>
          <p style="font-size:16px; text-align:center;">Your OTP for password reset:</p>
          <h1 style="text-align:center; color:#6A0DAD; letter-spacing:4px;">${otp}</h1>
          <p style="text-align:center; color:#555;">This OTP will expire in <strong>10 minutes</strong>.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ OTP send failed:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

export { otpStore };
