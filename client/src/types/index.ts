export const TASK_STATUSES = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'COMPLETED',
  'CANCELLED',
] as const

export type TaskStatus = (typeof TASK_STATUSES)[number]

export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface Category {
  id: string
  name: string
  color: string
  userId: string
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
  taskId: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  completedAt: string | null
  userId: string
  categoryId: string | null
  category?: Category | null
  subtasks?: Subtask[]
}

export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  categoryId?: string
  search?: string
  dueDateFrom?: string
  dueDateTo?: string
  sortBy?: 'id' | 'title' | 'status' | 'priority' | 'dueDate' | 'completedAt'
  order?: 'asc' | 'desc'
}

export interface MetricsOverview {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
  overdueTasks: number
}

export interface StatusCount {
  status: TaskStatus
  count: number
}

export interface PriorityCount {
  priority: TaskPriority
  count: number
}

export interface CategoryCount {
  categoryId: string | null
  name: string
  color: string | null
  count: number
}

export interface DayCompletion {
  date: string
  count: number
}

export interface UpcomingDeadline {
  id: string
  title: string
  dueDate: string
  status: TaskStatus
  priority: TaskPriority
  category: { name: string; color: string } | null
}

export interface MetricsResponse {
  overview: MetricsOverview
  byStatus: StatusCount[]
  byPriority: PriorityCount[]
  byCategory: CategoryCount[]
  weeklyCompletion: DayCompletion[]
  upcomingDeadlines: UpcomingDeadline[]
}
