import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useCategories'
import type { Category } from '@/types'

const { createCategory, updateCategory, deleteCategory, toast } = vi.hoisted(() => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('sonner', () => ({ toast }))
vi.mock('@/services/categories', () => ({ createCategory, updateCategory, deleteCategory }))

function makeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'cat-1',
    name: 'Trabajo',
    color: '#3b82f6',
    userId: 'user',
    ...overrides,
  }
}

function wrapper({ children }: { children: ReactNode }) {
  return createElement(QueryClientProvider, { client: queryClient }, children)
}

let queryClient: QueryClient

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  createCategory.mockReset().mockResolvedValue(makeCategory())
  updateCategory.mockReset().mockResolvedValue(makeCategory())
  deleteCategory.mockReset().mockResolvedValue({ id: 'cat-1' })
  toast.success.mockReset()
  toast.error.mockReset()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useCategories - toasts', () => {
  it('notifica el éxito al crear una categoría', async () => {
    const { result } = renderHook(() => useCreateCategory(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ name: 'Trabajo', color: '#3b82f6' })
    })

    expect(toast.success).toHaveBeenCalledWith('Categoría creada')
  })

  it('notifica el éxito al actualizar una categoría', async () => {
    const { result } = renderHook(() => useUpdateCategory(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 'cat-1', payload: { name: 'Oficina' } })
    })

    expect(toast.success).toHaveBeenCalledWith('Categoría actualizada')
  })

  it('notifica el éxito al eliminar una categoría', async () => {
    const { result } = renderHook(() => useDeleteCategory(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync('cat-1')
    })

    expect(toast.success).toHaveBeenCalledWith('Categoría eliminada')
  })

  it('notifica el error al crear una categoría', async () => {
    createCategory.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useCreateCategory(), { wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync({ name: 'Trabajo', color: '#3b82f6' })).rejects.toThrow(
        'Network error',
      )
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo crear la categoría')
  })

  it('notifica el error al actualizar una categoría', async () => {
    updateCategory.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useUpdateCategory(), { wrapper })

    await act(async () => {
      await expect(
        result.current.mutateAsync({ id: 'cat-1', payload: { name: 'Oficina' } }),
      ).rejects.toThrow('Network error')
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar la categoría')
  })

  it('notifica el error al eliminar una categoría', async () => {
    deleteCategory.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useDeleteCategory(), { wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync('cat-1')).rejects.toThrow('Network error')
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo eliminar la categoría')
  })
})
