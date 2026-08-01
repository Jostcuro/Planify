import { toDateKey } from '@/lib/format'
import type { Task } from '@/types'

export const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export interface CalendarGrid {
  year: number
  month: number
  startOffset: number
  daysInMonth: number
  cells: (number | null)[]
}

export function getCalendarGrid(year: number, month: number): CalendarGrid {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const blanks = Array.from({ length: startOffset }, () => null as number | null)
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  return { year, month, startOffset, daysInMonth, cells: [...blanks, ...days] }
}

export function getDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getMonthLabel(year: number, month: number): string {
  return capitalize(
    new Date(year, month, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
  )
}

export function groupTasksByDate(tasks: Task[]): Map<string, Task[]> {
  const map = new Map<string, Task[]>()
  for (const task of tasks) {
    if (!task.dueDate) continue
    const key = toDateKey(task.dueDate)
    const list = map.get(key)
    if (list) list.push(task)
    else map.set(key, [task])
  }
  return map
}

export function filterUndated(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.dueDate)
}
