import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import EmptyState from '@/components/ui/empty-state'
import ErrorState from '@/components/ui/error-state'

afterEach(cleanup)

describe('ErrorState', () => {
  it('muestra el título por defecto', () => {
    render(<ErrorState onRetry={() => {}} />)

    expect(screen.getByText('No se pudieron cargar los datos.')).toBeInTheDocument()
  })

  it('muestra título y descripción personalizados', () => {
    render(
      <ErrorState
        title="No se pudieron cargar las tareas."
        description="Revisa tu conexión."
        onRetry={() => {}}
      />,
    )

    expect(screen.getByText('No se pudieron cargar las tareas.')).toBeInTheDocument()
    expect(screen.getByText('Revisa tu conexión.')).toBeInTheDocument()
  })

  it('llama a onRetry al pulsar Reintentar', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})

describe('EmptyState', () => {
  it('muestra título y descripción', () => {
    render(<EmptyState title="Sin tareas" description="Crea una nueva." />)

    expect(screen.getByText('Sin tareas')).toBeInTheDocument()
    expect(screen.getByText('Crea una nueva.')).toBeInTheDocument()
  })

  it('renderiza la acción', () => {
    render(<EmptyState title="Sin tareas" action={<button>Crear</button>} />)

    expect(screen.getByRole('button', { name: 'Crear' })).toBeInTheDocument()
  })
})
