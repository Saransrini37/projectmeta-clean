import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { isAuthed } from "../_auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: "unauthorized" });

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: "invalid id" });

  try {
    if (req.method === "GET") {
      // 🔹 Load file with all possible relationships
      const file = await prisma.file.findUnique({
        where: { id },
        include: {
          project: { select: { id: true, title: true } },
          section: { select: { id: true, title: true, project: { select: { id: true, title: true } } } },
          topic: {
            select: {
              id: true,
              title: true,
              section: {
                select: {
                  id: true,
                  title: true,
                  project: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      });

      if (!file) return res.status(404).json({ error: "not found" });

      // 🔹 Safely extract the hierarchy (topic → section → project)
      const topic = file.topic;
      const section = file.section || topic?.section;
      const project =
        file.project || file.section?.project || topic?.section?.project;

      return res.json({
        ...file,
        projectId: project?.id || null,
        projectTitle: project?.title || null,
        sectionId: section?.id || null,
        sectionTitle: section?.title || null,
        topicId: topic?.id || null,
        topicTitle: topic?.title || null,
      });
    }

    if (req.method === "PUT") {
      const { filename, content } = req.body;
      const updated = await prisma.file.update({
        where: { id },
        data: { filename, content },
      });
      return res.json(updated);
    }

    if (req.method === "DELETE") {
      await prisma.file.delete({ where: { id } });
      return res.json({ ok: true });
    }

    return res.status(405).json({ error: "method not allowed" });
  } catch (err: any) {
    console.error("File fetch error:", err);
    return res
      .status(500)
      .json({ error: "server error", detail: err.message });
  }
}
