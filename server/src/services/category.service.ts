import { prisma } from '@/config/db.js'
import { HttpError } from '@/types/http-error.js'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/category.schema.js'

const DUPLICATE_CATEGORY_MESSAGE = 'Ya existe una categoría con ese nombre'
const CATEGORY_NOT_FOUND_MESSAGE = 'Categoría no encontrada'

export async function getUserCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })
}

async function assertNameAvailable(userId: string, name: string, excludeId?: string): Promise<void> {
  const existing = await prisma.category.findFirst({
    where: {
      userId,
      name: { equals: name, mode: 'insensitive' },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  })

  if (existing) {
    throw new HttpError(409, DUPLICATE_CATEGORY_MESSAGE)
  }
}

export async function createCategory(userId: string, data: CreateCategoryInput) {
  await assertNameAvailable(userId, data.name)

  return prisma.category.create({
    data: { name: data.name, color: data.color, userId },
  })
}

export async function updateCategory(userId: string, id: string, data: UpdateCategoryInput) {
  const existing = await prisma.category.findFirst({ where: { id, userId } })

  if (!existing) {
    throw new HttpError(404, CATEGORY_NOT_FOUND_MESSAGE)
  }

  if (data.name && data.name.toLowerCase() !== existing.name.toLowerCase()) {
    await assertNameAvailable(userId, data.name, id)
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.color ? { color: data.color } : {}),
    },
  })
}

export async function deleteCategory(userId: string, id: string) {
  const existing = await prisma.category.findFirst({ where: { id, userId } })

  if (!existing) {
    throw new HttpError(404, CATEGORY_NOT_FOUND_MESSAGE)
  }

  await prisma.category.delete({ where: { id } })

  return { id }
}
