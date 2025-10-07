import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { isAuthed } from '../_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'POST') {
    const { filename, content, projectId, sectionId, topicId, folderId } = req.body
    const file = await prisma.file.create({
      data: {
        filename,
        content,
        projectId: projectId ? Number(projectId) : null,
        sectionId: sectionId ? Number(sectionId) : null,
        topicId: topicId ? Number(topicId) : null,
        folderId: folderId ? Number(folderId) : null,
      },
    })
    return res.json(file)
  }

  return res.status(405).end()
}
