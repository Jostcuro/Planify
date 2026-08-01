import { describe, expect, it } from 'vitest'

import { toDefaults } from '@/components/tasks/TaskFormModal'
import type { Task } from '@/types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Tarea de prueba',
    description: null,
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '2026-08-15T12:00:00.000Z',
    completedAt: null,
    userId: 'user',
    categoryId: null,
    subtasks: [],
    ...overrides,
  }
}

describe('toDefaults', () => {
  it('en modo creación usa la fecha inicial prellenada', () => {
    const defaults = toDefaults(null, new Date(2026, 7, 10, 12))

    expect(defaults.title).toBe('')
    expect(defaults.status).toBe('TODO')
    expect(defaults.dueDate?.getTime()).toBe(new Date(2026, 7, 10, 12).getTime())
  })

  it('en modo creación sin fecha inicial deja dueDate en null', () => {
    expect(toDefaults(null).dueDate).toBeNull()
    expect(toDefaults(null, null).dueDate).toBeNull()
  })

  it('en modo edición la fecha de la tarea tiene precedencia sobre la inicial', () => {
    const task = makeTask({ dueDate: '2026-09-01T12:00:00.000Z' })
    const defaults = toDefaults(task, new Date(2026, 7, 10, 12))

    expect(defaults.title).toBe('Tarea de prueba')
    expect(defaults.dueDate?.toISOString()).toBe('2026-09-01T12:00:00.000Z')
  })

  it('en modo edición sin fecha mantiene dueDate en null aunque exista la inicial', () => {
    const task = makeTask({ dueDate: null })
    expect(toDefaults(task, new Date(2026, 7, 10, 12)).dueDate).toBeNull()
  })

  it('copia los datos de la tarea en modo edición', () => {
    const task = makeTask({
      title: 'Revisar PR',
      description: 'Contexto',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      categoryId: 'cat-1',
    })

    expect(toDefaults(task)).toMatchObject({
      title: 'Revisar PR',
      description: 'Contexto',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      categoryId: 'cat-1',
    })
  })
})
