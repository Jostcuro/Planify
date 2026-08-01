import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ConfirmDialog from '@/components/ui/confirm-dialog'

afterEach(cleanup)

describe('ConfirmDialog', () => {
  it('muestra el título y la descripción', () => {
    render(
      <ConfirmDialog
        open
        title="Eliminar tarea"
        description="¿Seguro que quieres eliminarla?"
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )

    expect(screen.getByText('Eliminar tarea')).toBeInTheDocument()
    expect(screen.getByText('¿Seguro que quieres eliminarla?')).toBeInTheDocument()
  })

  it('llama a onConfirm al confirmar', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Eliminar tarea"
        description="¿Seguro que quieres eliminarla?"
        onConfirm={onConfirm}
        onClose={() => {}}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('llama a onClose y no a onConfirm al cancelar', () => {
    const onConfirm = vi.fn()
    const onClose = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Eliminar tarea"
        description="¿Seguro que quieres eliminarla?"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('deshabilita los botones mientras está pendiente', () => {
    render(
      <ConfirmDialog
        open
        title="Eliminar tarea"
        description="¿Seguro que quieres eliminarla?"
        isPending
        onConfirm={() => {}}
        onClose={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })
})
