// pages/api/auth/verify-otp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { otpStore } from "./send-otp";

const fixedEmail = "saransrini37@gmail.com";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { otp } = req.body;
  const record = otpStore[fixedEmail];

  if (!record) return res.status(400).json({ error: "No OTP generated. Please request again." });
  if (Date.now() > record.expires) return res.status(400).json({ error: "OTP expired. Please request again." });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP. Please try again." });

  // ✅ OTP success
  delete otpStore[fixedEmail];
  res.status(200).json({ message: "OTP verified successfully" });
}
