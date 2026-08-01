import { getAuth } from '@clerk/express'
import { Prisma } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'

import { prisma } from '@/config/db.js'
import { mapClaimsToUser } from '@/middlewares/auth-claims.js'
import { asyncHandler } from '@/middlewares/asyncHandler.js'

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

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export const ensureUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, sessionClaims } = getAuth(req)

    if (!userId) {
      next()
      return
    }

    const profile = mapClaimsToUser(userId, (sessionClaims ?? {}) as Record<string, unknown>)

    try {
      await prisma.user.upsert({
        where: { id: profile.id },
        update: {},
        create: profile,
      })
    } catch (error) {
      if (isUniqueViolation(error)) {
        next()
        return
      }
      throw error
    }

    next()
  },
)
