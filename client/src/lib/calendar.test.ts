import { describe, expect, it } from 'vitest'

import {
  capitalize,
  filterUndated,
  getCalendarGrid,
  getDateKey,
  getMonthLabel,
  groupTasksByDate,
} from '@/lib/calendar'
import type { Task } from '@/types'

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

describe('getCalendarGrid', () => {
  it('agosto de 2026 empieza en sábado con 31 días', () => {
    const grid = getCalendarGrid(2026, 7)

    expect(grid.startOffset).toBe(5)
    expect(grid.daysInMonth).toBe(31)
    expect(grid.cells.length).toBe(36)
    expect(grid.cells.slice(0, 5)).toEqual([null, null, null, null, null])
    expect(grid.cells.slice(5, 6)).toEqual([1])
    expect(grid.cells[grid.cells.length - 1]).toBe(31)
  })

  it('febrero de 2026 no es bisiesto', () => {
    const grid = getCalendarGrid(2026, 1)

    expect(grid.daysInMonth).toBe(28)
  })

  it('febrero de 2028 es bisiesto', () => {
    const grid = getCalendarGrid(2028, 1)

    expect(grid.daysInMonth).toBe(29)
  })
})

describe('getDateKey', () => {
  it('rellena con ceros mes y día', () => {
    expect(getDateKey(2026, 0, 5)).toBe('2026-01-05')
    expect(getDateKey(2026, 11, 31)).toBe('2026-12-31')
    expect(getDateKey(2026, 7, 1)).toBe('2026-08-01')
  })
})

describe('getMonthLabel', () => {
  it('devuelve el mes en español capitalizado', () => {
    expect(getMonthLabel(2026, 7)).toBe('Agosto de 2026')
    expect(getMonthLabel(2026, 0)).toBe('Enero de 2026')
  })
})

describe('capitalize', () => {
  it('capitaliza la primera letra', () => {
    expect(capitalize('agosto')).toBe('Agosto')
    expect(capitalize('')).toBe('')
  })
})

describe('groupTasksByDate', () => {
  it('agrupa por clave de día local', () => {
    const tasks = [
      makeTask({ id: 'a', dueDate: new Date(2026, 7, 1, 8).toISOString() }),
      makeTask({ id: 'b', dueDate: new Date(2026, 7, 1, 20).toISOString() }),
      makeTask({ id: 'c', dueDate: new Date(2026, 7, 15, 12).toISOString() }),
      makeTask({ id: 'd', dueDate: null }),
    ]

    const grouped = groupTasksByDate(tasks)

    expect(grouped.get('2026-08-01')?.map((task) => task.id).sort()).toEqual(['a', 'b'])
    expect(grouped.get('2026-08-15')?.map((task) => task.id)).toEqual(['c'])
    expect(grouped.has('2026-08-02')).toBe(false)
  })

  it('devuelve un mapa vacío sin tareas', () => {
    expect(groupTasksByDate([]).size).toBe(0)
  })

  it('ignora tareas sin fecha', () => {
    const grouped = groupTasksByDate([makeTask({ id: 'a', dueDate: null })])

    expect(grouped.size).toBe(0)
  })
})

describe('filterUndated', () => {
  it('devuelve solo tareas sin fecha límite', () => {
    const tasks = [
      makeTask({ id: 'a', dueDate: null }),
      makeTask({ id: 'b', dueDate: '2026-08-01T12:00:00.000Z' }),
      makeTask({ id: 'c', dueDate: null }),
    ]

    expect(filterUndated(tasks).map((task) => task.id)).toEqual(['a', 'c'])
  })
})
