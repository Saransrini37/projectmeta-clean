// pages/api/auth/update-password.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend("re_K4k8eGrN_7KjdjQ4cGvEjWmJEiUyPjKbv"); // your Resend API key
const fixedEmail = "saransrini37@gmail.com"; // confirmation email receiver

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body;
  if (!password || password.length < 4)
    return res.status(400).json({ error: "Invalid password" });

  try {
    // 🔐 Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Store in local file
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "credentials.json");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify({ password: hashedPassword }), "utf8");

    console.log("✅ Password updated and encrypted");

    // 💌 Send confirmation email
    try {
      await resend.emails.send({
        from: "ProjectMate <onboarding@resend.dev>",
        to: fixedEmail,
        subject: "✅ Your ProjectMate Password Has Been Changed",
        html: `
          <div style="font-family: Arial, sans-serif; background:#f8f9fa; padding:20px; border-radius:8px; max-width:400px; margin:auto;">
            <h2 style="color:#6A0DAD; text-align:center;">ProjectMate</h2>
            <p style="text-align:center; font-size:16px;">Your password has been changed successfully.</p>
            <p style="text-align:center; color:#555;">If you didn’t request this change, please contact support immediately.</p>
          </div>
        `,
      });
      console.log("📧 Confirmation email sent successfully");
    } catch (mailErr) {
      console.error("❌ Failed to send confirmation email:", mailErr);
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err: any) {
    console.error("❌ Error updating password:", err);
    return res.status(500).json({ error: "Server error while updating password" });
  }
}
