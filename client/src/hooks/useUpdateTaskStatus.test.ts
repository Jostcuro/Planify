import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus'
import type { Task } from '@/types'

const { updateTask, fetchTasks } = vi.hoisted(() => ({
  updateTask: vi.fn(),
  fetchTasks: vi.fn(),
}))

vi.mock('@/services/tasks', () => ({ updateTask, fetchTasks }))

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

const BASE_TASKS: Task[] = [makeTask({ id: 'a', status: 'TODO' }), makeTask({ id: 'b', status: 'TODO' })]

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
  queryClient.setQueryData(TASKS_KEY, structuredClone(BASE_TASKS))
  updateTask.mockReset()
  fetchTasks.mockReset().mockResolvedValue(structuredClone(BASE_TASKS))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useUpdateTaskStatus', () => {
  it('aplica el nuevo status en la cache de forma optimista antes de que responda la API', async () => {
    let resolveUpdate!: (task: Task) => void
    updateTask.mockImplementation(
      () => new Promise<Task>((resolve) => { resolveUpdate = resolve }),
    )

    const { result } = renderHook(() => useUpdateTaskStatus(), { wrapper })

    const promise = result.current.mutateAsync({ id: 'a', status: 'IN_PROGRESS' })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const optimistic = queryClient.getQueryData<Task[]>(TASKS_KEY)
    expect(optimistic?.find((task) => task.id === 'a')?.status).toBe('IN_PROGRESS')
    expect(optimistic?.find((task) => task.id === 'b')?.status).toBe('TODO')
    expect(updateTask).toHaveBeenCalledWith('a', { status: 'IN_PROGRESS' })

    await act(async () => {
      resolveUpdate(makeTask({ id: 'a', status: 'IN_PROGRESS' }))
      await promise
    })
  })

  it('revierte el status en la cache cuando la API falla', async () => {
    updateTask.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useUpdateTaskStatus(), { wrapper })

    await act(async () => {
      await expect(result.current.mutateAsync({ id: 'a', status: 'IN_PROGRESS' })).rejects.toThrow(
        'Network error',
      )
    })

    const afterRollback = queryClient.getQueryData<Task[]>(TASKS_KEY)
    expect(afterRollback?.find((task) => task.id === 'a')?.status).toBe('TODO')
    expect(afterRollback?.find((task) => task.id === 'b')?.status).toBe('TODO')
  })

  it('no toca la cache cuando el status no cambia', async () => {
    updateTask.mockResolvedValue(makeTask({ id: 'a', status: 'TODO' }))

    const { result } = renderHook(() => useUpdateTaskStatus(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 'a', status: 'TODO' })
    })

    const data = queryClient.getQueryData<Task[]>(TASKS_KEY)
    expect(data?.find((task) => task.id === 'a')?.status).toBe('TODO')
  })
})
