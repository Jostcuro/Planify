import { describe, expect, it } from 'vitest'

import { getErrorMessage } from '@/lib/api-error'

describe('getErrorMessage', () => {
  it('devuelve el error del servidor', () => {
    const error = { response: { data: { error: 'El título es obligatorio' } } }

    expect(getErrorMessage(error)).toBe('El título es obligatorio')
  })

  it('usa el fallback por defecto cuando no hay respuesta', () => {
    expect(getErrorMessage(new Error('Network Error'))).toBe('Ocurrió un error inesperado')
  })

  it('usa un fallback personalizado', () => {
    expect(getErrorMessage(null, 'No se pudo eliminar la tarea')).toBe('No se pudo eliminar la tarea')
  })
})
