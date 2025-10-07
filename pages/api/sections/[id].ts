import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { isAuthed } from "../_auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: "unauthorized" });

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    if (req.method === "GET") {
      const section = await prisma.section.findUnique({
        where: { id },
        include: {
          topics: true,
          folders: true,
          files: true,
          project: { select: { id: true, title: true } }
        }
      });

      if (!section) return res.status(404).json({ error: "not found" });

      return res.json({
        ...section,
        projectId: section.project.id,
        projectTitle: section.project.title
      });
    }

    if (req.method === "PUT") {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: "title required" });

      const updated = await prisma.section.update({
        where: { id },
        data: { title }
      });
      return res.json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.section.delete({ where: { id } });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: "method not allowed" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "server error", detail: err.message });
  }
}
