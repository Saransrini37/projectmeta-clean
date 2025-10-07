import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { isAuthed } from '../_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' })
  const id = Number(req.query.id)
  if (isNaN(id)) return res.status(400).json({ error: 'invalid id' })

  if (req.method === 'GET') {
    const project = await prisma.project.findUnique({ where: { id }, include: { sections: true, folders: true, files: true } })
    if (!project) return res.status(404).json({ error: 'not found' })
    return res.json(project)
  }

  if (req.method === 'PUT') {
    const { title, description } = req.body
    const updated = await prisma.project.update({ where: { id }, data: { title, description } })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    await prisma.project.delete({ where: { id } })
    return res.json({ ok: true })
  }

  return res.status(405).end()
}
