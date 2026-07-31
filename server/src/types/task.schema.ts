import { TaskPriority, TaskStatus } from '@prisma/client'
import { z } from 'zod'

const TASK_STATUSES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'] as const
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const

const csvEnumArray = <const T extends readonly string[]>(values: T) =>
  z
    .preprocess(
      (value) => (typeof value === 'string' ? value.split(',') : value),
      z.array(z.string()),
    )
    .pipe(z.array(z.enum(values)))
    .optional()

export const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).optional().default(TaskPriority.MEDIUM),
  dueDate: z.coerce.date().nullable().optional(),
  categoryId: z.string().min(1).nullable().optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
        completed: z.boolean().optional(),
      }),
    )
    .max(20, 'Máximo 20 subtareas por tarea')
    .optional(),
})

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres').optional(),
    description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.coerce.date().nullable().optional(),
    categoryId: z.string().min(1).nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Debe enviar al menos un campo para actualizar',
  })

export const taskFiltersSchema = z
  .object({
    status: csvEnumArray(TASK_STATUSES),
    priority: csvEnumArray(TASK_PRIORITIES),
    categoryId: z.string().min(1).optional(),
    search: z.string().min(1).max(100).optional(),
    dueDateFrom: z.coerce.date().optional(),
    dueDateTo: z.coerce.date().optional(),
    sortBy: z.enum(['id', 'title', 'status', 'priority', 'dueDate', 'completedAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  })
  .refine((data) => !data.dueDateFrom || !data.dueDateTo || data.dueDateTo >= data.dueDateFrom, {
    message: 'dueDateTo debe ser mayor o igual que dueDateFrom',
    path: ['dueDateTo'],
  })

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskFilters = z.infer<typeof taskFiltersSchema>
