import { prisma } from '@/config/db.js'
import { HttpError } from '@/types/http-error.js'
import type { CreateSubtaskInput } from '@/types/subtask.schema.js'

const TASK_NOT_FOUND_MESSAGE = 'Tarea no encontrada'
const SUBTASK_NOT_FOUND_MESSAGE = 'Subtarea no encontrada'
const MAX_SUBTASKS_MESSAGE = 'Máximo 20 subtareas por tarea'

const MAX_SUBTASKS = 20

async function getOwnedTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } })

  if (!task) {
    throw new HttpError(404, TASK_NOT_FOUND_MESSAGE)
  }

  return task
}

async function getOwnedSubtask(userId: string, subtaskId: string) {
  const subtask = await prisma.subtask.findFirst({
    where: { id: subtaskId },
    include: { task: true },
  })

  if (!subtask || subtask.task.userId !== userId) {
    throw new HttpError(404, SUBTASK_NOT_FOUND_MESSAGE)
  }

  return subtask
}

export async function createSubtask(userId: string, taskId: string, data: CreateSubtaskInput) {
  await getOwnedTask(userId, taskId)

  const subtaskCount = await prisma.subtask.count({ where: { taskId } })

  if (subtaskCount >= MAX_SUBTASKS) {
    throw new HttpError(400, MAX_SUBTASKS_MESSAGE)
  }

  return prisma.subtask.create({
    data: {
      title: data.title,
      completed: data.completed ?? false,
      taskId,
    },
  })
}

export async function toggleSubtask(userId: string, subtaskId: string) {
  const subtask = await getOwnedSubtask(userId, subtaskId)

  return prisma.subtask.update({
    where: { id: subtask.id },
    data: { completed: !subtask.completed },
  })
}

export async function deleteSubtask(userId: string, subtaskId: string) {
  const subtask = await getOwnedSubtask(userId, subtaskId)

  await prisma.subtask.delete({ where: { id: subtask.id } })

  return { id: subtask.id }
}
