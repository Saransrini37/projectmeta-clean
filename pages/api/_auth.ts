import { parse } from 'cookie'
import type { NextApiRequest } from 'next'

export function isAuthed(req: NextApiRequest) {
  const cookie = req.headers.cookie
  if (!cookie) return false
  const parsed = parse(cookie)
  return parsed.projectmate_session === '1'
}
