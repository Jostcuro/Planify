import { getAuth } from '@clerk/express'
import type { NextFunction, Request, Response } from 'express'

const UNAUTHENTICATED_MESSAGE = 'No autenticado'

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const { userId } = getAuth(req)

  if (!userId) {
    res.status(401).json({ success: false, error: UNAUTHENTICATED_MESSAGE })
    return
  }

  next()
}

export function injectUser(req: Request, res: Response, next: NextFunction): void {
  const { userId } = getAuth(req)

  if (!userId) {
    res.status(401).json({ success: false, error: UNAUTHENTICATED_MESSAGE })
    return
  }

  req.userId = userId
  next()
}
