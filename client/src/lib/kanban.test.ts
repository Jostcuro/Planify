import { describe, expect, it } from 'vitest'

import { groupTasksByStatus, isValidStatus, subtaskProgress } from '@/lib/kanban'
import { TASK_STATUSES, type Task } from '@/types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `task-${Math.random().toString(36).slice(2)}`,
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

describe('groupTasksByStatus', () => {
  it('devuelve las 6 columnas vacías cuando no hay tareas', () => {
    const groups = groupTasksByStatus([])
    for (const status of TASK_STATUSES) {
      expect(groups[status]).toEqual([])
    }
  })

  it('agrupa cada tarea en su columna de status', () => {
    const tasks = [
      makeTask({ id: 'a', status: 'BACKLOG' }),
      makeTask({ id: 'b', status: 'TODO' }),
      makeTask({ id: 'c', status: 'TODO' }),
      makeTask({ id: 'd', status: 'IN_PROGRESS' }),
      makeTask({ id: 'e', status: 'COMPLETED' }),
    ]

    const groups = groupTasksByStatus(tasks)

    expect(groups.BACKLOG.map((task) => task.id)).toEqual(['a'])
    expect(groups.TODO.map((task) => task.id)).toEqual(['b', 'c'])
    expect(groups.IN_PROGRESS.map((task) => task.id)).toEqual(['d'])
    expect(groups.COMPLETED.map((task) => task.id)).toEqual(['e'])
    expect(groups.IN_REVIEW).toEqual([])
    expect(groups.CANCELLED).toEqual([])
  })
})

describe('subtaskProgress', () => {
  it('calcula el progreso completado/total', () => {
    const progress = subtaskProgress({
      subtasks: [
        { id: '1', title: 'a', completed: true, taskId: 't' },
        { id: '2', title: 'b', completed: false, taskId: 't' },
        { id: '3', title: 'c', completed: false, taskId: 't' },
        { id: '4', title: 'd', completed: true, taskId: 't' },
      ],
    })
    expect(progress).toEqual({ done: 2, total: 4 })
  })

  it('devuelve 0/0 cuando no hay subtasks', () => {
    expect(subtaskProgress({ subtasks: [] })).toEqual({ done: 0, total: 0 })
    expect(subtaskProgress({ subtasks: undefined })).toEqual({ done: 0, total: 0 })
  })
})

describe('isValidStatus', () => {
  it('reconoce los valores válidos del enum', () => {
    for (const status of TASK_STATUSES) {
      expect(isValidStatus(status)).toBe(true)
    }
  })

  it('rechaza valores ajenos al enum', () => {
    expect(isValidStatus('DONE')).toBe(false)
    expect(isValidStatus('')).toBe(false)
    expect(isValidStatus(undefined)).toBe(false)
    expect(isValidStatus({})).toBe(false)
  })
})
