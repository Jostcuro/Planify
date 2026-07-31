import { z } from 'zod'

export const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'El color debe tener formato HEX (#RRGGBB)',
})

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  color: hexColorSchema,
})

export const updateCategorySchema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres').optional(),
    color: hexColorSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'Debe enviar al menos un campo para actualizar',
  })

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
