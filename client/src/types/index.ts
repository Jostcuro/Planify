export type TaskStatus =
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'COMPLETED'
  | 'CANCELLED'

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

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

export interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  categoryId?: string | null
  subtasks?: { title: string; completed?: boolean }[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string | null
  categoryId?: string | null
}

export interface CreateSubtaskInput {
  title: string
  completed?: boolean
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
