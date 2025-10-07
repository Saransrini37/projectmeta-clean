import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const PASSWORD_FILE = path.join(process.cwd(), "data", "password.json");

// ensure data folder exists
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword)
    return res.status(400).json({ error: "Missing fields" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: "Passwords do not match" });

  // save new password to local file
  fs.writeFileSync(PASSWORD_FILE, JSON.stringify({ password: newPassword }));

  return res.status(200).json({ message: "Password changed successfully" });
}
