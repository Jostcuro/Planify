import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCreateSubtask, useDeleteSubtask, useToggleSubtask } from '@/hooks/useSubtasks'
import type { Subtask, Task } from '@/types'

const { createSubtask, toggleSubtask, deleteSubtask } = vi.hoisted(() => ({
  createSubtask: vi.fn(),
  toggleSubtask: vi.fn(),
  deleteSubtask: vi.fn(),
}))

vi.mock('@/services/subtasks', () => ({ createSubtask, toggleSubtask, deleteSubtask }))

const TASKS_KEY = ['tasks', undefined]

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

function makeSubtask(overrides: Partial<Subtask> = {}): Subtask {
  return {
    id: 'sub-1',
    title: 'Subtarea',
    completed: false,
    taskId: 'a',
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
  queryClient.setQueryData(TASKS_KEY, [makeTask({ id: 'a' })])
  queryClient.setQueryData(['task', 'a'], makeTask({ id: 'a', subtasks: [makeSubtask()] }))
  createSubtask.mockReset().mockResolvedValue(makeSubtask({ id: 'sub-2' }))
  toggleSubtask.mockReset().mockResolvedValue(makeSubtask({ completed: true }))
  deleteSubtask.mockReset().mockResolvedValue({ id: 'sub-1' })
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useSubtasks', () => {
  it('invalida la lista y el detalle al crear una subtarea', async () => {
    const { result } = renderHook(() => useCreateSubtask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'a', payload: { title: 'Nueva subtarea' } })
    })

    expect(createSubtask).toHaveBeenCalledWith('a', { title: 'Nueva subtarea' })
    expect(queryClient.getQueryState(TASKS_KEY)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['task', 'a'])?.isInvalidated).toBe(true)
  })

  it('invalida la lista y el detalle al marcar una subtarea', async () => {
    const { result } = renderHook(() => useToggleSubtask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'a', subtaskId: 'sub-1' })
    })

    expect(toggleSubtask).toHaveBeenCalledWith('a', 'sub-1')
    expect(queryClient.getQueryState(TASKS_KEY)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['task', 'a'])?.isInvalidated).toBe(true)
  })

  it('invalida la lista y el detalle al eliminar una subtarea', async () => {
    const { result } = renderHook(() => useDeleteSubtask(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ taskId: 'a', subtaskId: 'sub-1' })
    })

    expect(deleteSubtask).toHaveBeenCalledWith('a', 'sub-1')
    expect(queryClient.getQueryState(TASKS_KEY)?.isInvalidated).toBe(true)
    expect(queryClient.getQueryState(['task', 'a'])?.isInvalidated).toBe(true)
  })
})
