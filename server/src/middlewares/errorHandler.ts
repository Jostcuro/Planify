import type { NextFunction, Request, Response } from 'express'

const NOT_FOUND_MESSAGE = 'Recurso no encontrado'
const INTERNAL_ERROR_MESSAGE = 'Error interno del servidor'

interface HttpError extends Error {
  status?: number | string
  statusCode?: number | string
}

function getHttpStatus(error: HttpError): number {
  const raw = typeof error.status === 'number' ? error.status : error.statusCode ?? error.status
  const status = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10)

  if (Number.isInteger(status) && status >= 400 && status <= 599) {
    return status
  }

  return 500
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
  const status = getHttpStatus(error)

  if (status >= 500) {
    console.error('[errorHandler]', error)
  }

  res.status(status).json({
    success: false,
    error: status >= 500 ? INTERNAL_ERROR_MESSAGE : error.message,
  })
}
