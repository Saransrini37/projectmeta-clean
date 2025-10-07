import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { isAuthed } from "../_auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: "unauthorized" });

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    if (req.method === "GET") {
      const topic = await prisma.topic.findUnique({
        where: { id },
        include: {
          folders: true,
          files: true,
          section: {
            include: {
              project: { select: { id: true, title: true } } // ✅ project title included
            }
          }
        }
      });

      if (!topic) return res.status(404).json({ error: "not found" });

      return res.json({
        ...topic,
        sectionId: topic.section.id,
        sectionTitle: topic.section.title,
        projectId: topic.section.projectId,
        projectTitle: topic.section.project.title
      });
    }

    if (req.method === "PUT") {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: "title required" });

      const updated = await prisma.topic.update({
        where: { id },
        data: { title }
      });
      return res.json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.topic.delete({ where: { id } });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: "method not allowed" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "server error", detail: err.message });
  }
}
