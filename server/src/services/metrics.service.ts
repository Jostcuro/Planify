import { TaskPriority, TaskStatus } from '@prisma/client'

import { prisma } from '@/config/db.js'
import type {
  CategoryCount,
  DayCompletion,
  MetricsResponse,
  PriorityCount,
  StatusCount,
  UpcomingDeadline,
} from '@/types/metrics.js'

const NOT_DONE_STATUSES: TaskStatus[] = [TaskStatus.COMPLETED, TaskStatus.CANCELLED]

const ALL_STATUSES: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.COMPLETED,
  TaskStatus.CANCELLED,
]

const ALL_PRIORITIES: TaskPriority[] = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
  TaskPriority.URGENT,
]

const UNCATEGORIZED_NAME = 'Sin categoría'

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function calculateMetrics(userId: string): Promise<MetricsResponse> {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - 6)

  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    statusGroups,
    priorityGroups,
    categoryGroups,
    categories,
    weeklyGroups,
    upcoming,
  ] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
    prisma.task.count({ where: { userId, status: { notIn: NOT_DONE_STATUSES } } }),
    prisma.task.count({
      where: { userId, dueDate: { lt: now }, status: { notIn: NOT_DONE_STATUSES } },
    }),
    prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.task.groupBy({
      by: ['priority'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.task.groupBy({
      by: ['categoryId'],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.category.findMany({
      where: { userId },
      select: { id: true, name: true, color: true },
    }),
    prisma.task.groupBy({
      by: ['completedAt'],
      where: { userId, status: TaskStatus.COMPLETED, completedAt: { gte: weekStart } },
      _count: { _all: true },
    }),
    prisma.task.findMany({
      where: { userId, dueDate: { gte: now }, status: { notIn: NOT_DONE_STATUSES } },
      orderBy: { dueDate: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        priority: true,
        category: { select: { name: true, color: true } },
      },
    }),
  ])

  const completionRate = totalTasks === 0 ? 0 : completedTasks / totalTasks

  const statusCounts: StatusCount[] = ALL_STATUSES.map((status) => {
    const group = statusGroups.find((item) => item.status === status)
    return { status, count: group?._count._all ?? 0 }
  })

  const priorityCounts: PriorityCount[] = ALL_PRIORITIES.map((priority) => {
    const group = priorityGroups.find((item) => item.priority === priority)
    return { priority, count: group?._count._all ?? 0 }
  })

  const categoryMap = new Map(categories.map((category) => [category.id, category]))
  const categoryCounts: CategoryCount[] = categoryGroups
    .map((group) => {
      if (!group.categoryId) {
        return { categoryId: null, name: UNCATEGORIZED_NAME, color: null, count: group._count._all }
      }

      const category = categoryMap.get(group.categoryId)
      return {
        categoryId: category?.id ?? null,
        name: category?.name ?? UNCATEGORIZED_NAME,
        color: category?.color ?? null,
        count: group._count._all,
      }
    })
    .sort((a, b) => b.count - a.count)

  const weeklyCounts = new Map<string, number>()
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    weeklyCounts.set(toDateKey(day), 0)
  }
  for (const group of weeklyGroups) {
    if (!group.completedAt) continue
    const key = toDateKey(group.completedAt)
    weeklyCounts.set(key, (weeklyCounts.get(key) ?? 0) + group._count._all)
  }
  const weeklyCompletion: DayCompletion[] = [...weeklyCounts.entries()].map(([date, count]) => ({
    date,
    count,
  }))

  const upcomingDeadlines: UpcomingDeadline[] = upcoming.map((task) => ({
    id: task.id,
    title: task.title,
    dueDate: task.dueDate!,
    status: task.status,
    priority: task.priority,
    category: task.category,
  }))

  return {
    overview: { totalTasks, completedTasks, pendingTasks, completionRate, overdueTasks },
    byStatus: statusCounts,
    byPriority: priorityCounts,
    byCategory: categoryCounts,
    weeklyCompletion,
    upcomingDeadlines,
  }
}
