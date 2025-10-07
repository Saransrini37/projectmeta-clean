// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { password } = req.body;
  const filePath = path.join(process.cwd(), "data", "credentials.json");

  let storedHash = "";
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      storedHash = data.password || "";
    } catch (err) {
      console.error("⚠️ Failed to read password file:", err);
    }
  }

  // 🔐 Compare hashed password
  const match = storedHash ? await bcrypt.compare(password, storedHash) : password === "admin";

  if (match) {
    res.setHeader(
      "Set-Cookie",
      serialize("projectmate_session", "1", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24,
      })
    );
    return res.status(200).json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid password" });
}
