import type { Category } from '@/types'
import { api } from '@/services/api'

export interface CreateCategoryPayload {
  name: string
  color: string
}

export interface UpdateCategoryPayload {
  name?: string
  color?: string
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories')
  return data.data
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const { data } = await api.post<{ success: boolean; data: Category }>('/categories', payload)
  return data.data
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<Category> {
  const { data } = await api.patch<{ success: boolean; data: Category }>(`/categories/${id}`, payload)
  return data.data
}

export async function deleteCategory(id: string): Promise<{ id: string }> {
  const { data } = await api.delete<{ success: boolean; data: { id: string } }>(`/categories/${id}`)
  return data.data
}
