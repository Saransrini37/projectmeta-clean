import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { isAuthed } from '../_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'POST') {
    const { title, sectionId } = req.body
    const topic = await prisma.topic.create({ data: { title, sectionId: Number(sectionId) } })
    return res.json(topic)
  }

  return res.status(405).end()
}
