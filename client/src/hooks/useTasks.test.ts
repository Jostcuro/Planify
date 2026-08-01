import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateTask, useDeleteTask, useUpdateTask } from '@/hooks/useTasks'
import type { Task } from '@/types'

const { createTask, updateTask, deleteTask, toast } = vi.hoisted(() => ({
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('sonner', () => ({ toast }))
vi.mock('@/services/tasks', () => ({ createTask, updateTask, deleteTask }))

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Tarea',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    completedAt: null,
    userId: 'user',
    categoryId: null,
    subtasks: [],
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
  createTask.mockReset().mockResolvedValue(makeTask())
  updateTask.mockReset().mockResolvedValue(makeTask())
  deleteTask.mockReset().mockResolvedValue({ id: 'task-1' })
  toast.success.mockReset()
  toast.error.mockReset()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useTasks - toasts', () => {
  it('notifica el éxito al crear una tarea', async () => {
    const { result } = renderHook(() => useCreateTask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ title: 'Nueva tarea', priority: 'MEDIUM' })
    })

    expect(toast.success).toHaveBeenCalledWith('Tarea creada')
  })

  it('notifica el éxito al actualizar una tarea', async () => {
    const { result } = renderHook(() => useUpdateTask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 'task-1', payload: { status: 'IN_PROGRESS' } })
    })

    expect(toast.success).toHaveBeenCalledWith('Tarea actualizada')
  })

  it('notifica el éxito al eliminar una tarea', async () => {
    const { result } = renderHook(() => useDeleteTask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync('task-1')
    })

    expect(toast.success).toHaveBeenCalledWith('Tarea eliminada')
  })

  it('notifica el error al crear una tarea', async () => {
    createTask.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useCreateTask(), { wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync({ title: 'Nueva tarea' })).rejects.toThrow('Network error')
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo crear la tarea')
  })

  it('notifica el error al actualizar una tarea', async () => {
    updateTask.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useUpdateTask(), { wrapper })

    await act(async () => {
      await expect(
        result.current.mutateAsync({ id: 'task-1', payload: { status: 'IN_PROGRESS' } }),
      ).rejects.toThrow('Network error')
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar la tarea')
  })

  it('notifica el error al eliminar una tarea', async () => {
    deleteTask.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useDeleteTask(), { wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync('task-1')).rejects.toThrow('Network error')
    })

    expect(toast.error).toHaveBeenCalledWith('No se pudo eliminar la tarea')
  })
})
