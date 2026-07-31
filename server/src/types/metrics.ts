import type { TaskPriority, TaskStatus } from '@prisma/client'

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
  dueDate: Date
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
