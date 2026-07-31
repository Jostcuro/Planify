import { TaskStatus } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/config/db.js'
import { HttpError } from '@/types/http-error.js'
import type { CreateTaskInput, TaskFilters, UpdateTaskInput } from '@/types/task.schema.js'

const TASK_NOT_FOUND_MESSAGE = 'Tarea no encontrada'
const INVALID_CATEGORY_MESSAGE = 'Categoría no válida'

async function assertCategoryOwnership(userId: string, categoryId: string): Promise<void> {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } })

  if (!category) {
    throw new HttpError(400, INVALID_CATEGORY_MESSAGE)
  }
}

export async function getTasks(userId: string, filters: TaskFilters = {}) {
  const where: Prisma.TaskWhereInput = {
    userId,
    ...(filters.status?.length ? { status: { in: filters.status } } : {}),
    ...(filters.priority?.length ? { priority: { in: filters.priority } } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(filters.dueDateFrom || filters.dueDateTo
      ? {
          dueDate: {
            ...(filters.dueDateFrom ? { gte: filters.dueDateFrom } : {}),
            ...(filters.dueDateTo ? { lte: filters.dueDateTo } : {}),
          },
        }
      : {}),
  }

  const sortBy = filters.sortBy ?? 'dueDate'
  const order = filters.order ?? 'asc'
  const orderBy = { [sortBy]: order } as Prisma.TaskOrderByWithRelationInput

  return prisma.task.findMany({ where, orderBy })
}

export async function getTaskById(userId: string, id: string) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
    include: {
      category: true,
      subtasks: { orderBy: { title: 'asc' } },
    },
  })

  if (!task) {
    throw new HttpError(404, TASK_NOT_FOUND_MESSAGE)
  }

  return task
}

export async function createTask(userId: string, data: CreateTaskInput) {
  if (data.categoryId) {
    await assertCategoryOwnership(userId, data.categoryId)
  }

  const completedAt = data.status === TaskStatus.COMPLETED ? new Date() : null

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      completedAt,
      userId,
      categoryId: data.categoryId ?? null,
      ...(data.subtasks?.length
        ? {
            subtasks: {
              create: data.subtasks.map((subtask) => ({
                title: subtask.title,
                completed: subtask.completed ?? false,
              })),
            },
          }
        : {}),
    },
    include: { category: true, subtasks: true },
  })
}

export async function updateTask(userId: string, id: string, data: UpdateTaskInput) {
  const existing = await getTaskById(userId, id)

  if (data.categoryId && data.categoryId !== existing.categoryId) {
    await assertCategoryOwnership(userId, data.categoryId)
  }

  const nextStatus = data.status ?? existing.status
  let completedAt = existing.completedAt

  if (nextStatus === TaskStatus.COMPLETED && !completedAt) {
    completedAt = new Date()
  } else if (nextStatus !== TaskStatus.COMPLETED) {
    completedAt = null
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      completedAt,
    },
    include: { category: true, subtasks: true },
  })
}

export async function deleteTask(userId: string, id: string) {
  await getTaskById(userId, id)

  await prisma.task.delete({ where: { id } })

  return { id }
}
