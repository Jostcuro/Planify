interface ApiErrorResponse {
  response?: {
    data?: { error?: string }
  }
}

const DEFAULT_FALLBACK = 'Ocurrió un error inesperado'

export function getErrorMessage(error: unknown, fallback = DEFAULT_FALLBACK): string {
  const data = (error as ApiErrorResponse)?.response?.data
  return data?.error ?? fallback
}
