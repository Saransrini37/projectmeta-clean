import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', serialize('projectmate_session', '', { path: '/', maxAge: 0 }))
  res.json({ ok: true })
}
