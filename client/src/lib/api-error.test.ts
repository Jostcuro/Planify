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

  it('muestra el primer detalle en errores de validación', () => {
    const error = {
      response: {
        data: {
          error: 'Validación fallida',
          details: [
            { path: 'title', message: 'El título es obligatorio' },
            { path: 'priority', message: 'Prioridad inválida' },
          ],
        },
      },
    }

    expect(getErrorMessage(error)).toBe('El título es obligatorio')
  })

  it('muestra el error del servidor cuando no hay detalles de validación', () => {
    const error = {
      response: {
        data: { error: 'Validación fallida', details: [] },
      },
    }

    expect(getErrorMessage(error)).toBe('Validación fallida')
  })
})
