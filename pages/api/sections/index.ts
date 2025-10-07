import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { isAuthed } from '../_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'POST') {
    const { title, projectId } = req.body
    const section = await prisma.section.create({ data: { title, projectId: Number(projectId) } })
    return res.json(section)
  }

  return res.status(405).end()
}
