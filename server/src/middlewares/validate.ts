import type { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ZodType } from 'zod'

const VALIDATION_ERROR_MESSAGE = 'Validación fallida'

function sendValidationError(res: Response, error: { issues: { path: PropertyKey[]; message: string }[] }): void {
  res.status(400).json({
    success: false,
    error: VALIDATION_ERROR_MESSAGE,
    details: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
  })
}

export function validateBody<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }

    req.body = result.data
    next()
  }
}

export function validateQuery<T>(schema: ZodType<T>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)

    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }

    res.locals.query = result.data
    next()
  }
}
