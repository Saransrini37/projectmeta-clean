import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { isAuthed } from '../_auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'GET') {
    const projects = await prisma.project.findMany({ include: { sections: true, folders: true, files: true } })
    return res.json(projects)
  }

  if (req.method === 'POST') {
    const { title, description } = req.body
    const project = await prisma.project.create({ data: { title, description } })
    return res.status(201).json(project)
  }

  return res.status(405).end()
}
