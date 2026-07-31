import type { NextFunction, Request, Response } from 'express'

const NOT_FOUND_MESSAGE = 'Recurso no encontrado'
const INTERNAL_ERROR_MESSAGE = 'Error interno del servidor'

interface HttpError extends Error {
  status?: number
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `${NOT_FOUND_MESSAGE}: ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = error.status ?? 500

  if (status >= 500) {
    console.error('[errorHandler]', error)
  }

  res.status(status).json({
    success: false,
    error: status >= 500 ? INTERNAL_ERROR_MESSAGE : error.message,
  })
}
