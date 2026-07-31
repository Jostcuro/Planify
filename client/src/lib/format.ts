import type { TaskPriority, TaskStatus } from '@/types'

export const STATUS_LABELS: Record<TaskStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  IN_REVIEW: 'En revisión',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
}

export const STATUS_BADGE: Record<TaskStatus, string> = {
  BACKLOG: 'bg-slate-100 text-slate-700',
  TODO: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  IN_REVIEW: 'bg-violet-100 text-violet-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
}

export const ALL_STATUSES: TaskStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'COMPLETED',
  'CANCELLED',
]

export const ALL_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']

export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatShortDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function dateInputToIso(value: string): string | null {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day, 12, 0, 0).toISOString()
}

export function toDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  return due.getTime() < today.getTime()
}

export function isToday(dueDate: string | null): boolean {
  if (!dueDate) return false
  return toDateKey(dueDate) === toDateKey(new Date())
}

export function getCategoryStyle(color: string | null | undefined): string {
  if (!color) return '#3b82f6'
  return color
}

export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized
        .split('')
        .map((char) => char + char)
        .join('')
    : normalized
  const int = Number.parseInt(full, 16)
  const red = (int >> 16) & 255
  const green = (int >> 8) & 255
  const blue = int & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
