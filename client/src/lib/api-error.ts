interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string
      details?: Array<{ path?: string | string[]; message?: string }>
    }
  }
}

const DEFAULT_FALLBACK = 'Ocurrió un error inesperado'
const VALIDATION_ERROR = 'Validación fallida'

export function getErrorMessage(error: unknown, fallback = DEFAULT_FALLBACK): string {
  const data = (error as ApiErrorResponse)?.response?.data

  if (!data?.error) return fallback

  if (data.error === VALIDATION_ERROR) {
    const detail = data.details?.find((item) => item.message)
    if (detail?.message) return detail.message
  }

  return data.error
}
