import { z } from 'zod'

export const createSubtaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  completed: z.boolean().optional(),
})

export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>
