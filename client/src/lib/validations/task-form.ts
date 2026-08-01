import { z } from 'zod'

import { TASK_PRIORITIES, TASK_STATUSES } from '@/types'

export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres'),
  priority: z.enum(TASK_PRIORITIES),
  status: z.enum(TASK_STATUSES),
  dueDate: z.date().nullable(),
  categoryId: z.string().nullable(),
  subtasks: z
    .array(
      z.object({
        title: z.string().max(200, 'Máximo 200 caracteres'),
      }),
    )
    .max(20, 'Máximo 20 subtareas'),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
