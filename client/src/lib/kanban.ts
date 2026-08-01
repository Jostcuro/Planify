import { ALL_STATUSES } from '@/lib/format'
import type { Task, TaskStatus } from '@/types'

export type KanbanGroups = Record<TaskStatus, Task[]>

export function groupTasksByStatus(tasks: Task[]): KanbanGroups {
  const groups: KanbanGroups = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    COMPLETED: [],
    CANCELLED: [],
  }
  for (const task of tasks) {
    groups[task.status].push(task)
  }
  return groups
}

export interface SubtaskProgress {
  done: number
  total: number
}

export function subtaskProgress(task: Pick<Task, 'subtasks'>): SubtaskProgress {
  const subtasks = task.subtasks ?? []
  return {
    done: subtasks.filter((subtask) => subtask.completed).length,
    total: subtasks.length,
  }
}

export function isValidStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && (ALL_STATUSES as string[]).includes(value)
}
