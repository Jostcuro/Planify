import type { Task, TaskFilters } from '@/types'
import { api } from '@/services/api'

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  dueDate?: string | null
  categoryId?: string | null
  subtasks?: { title: string; completed?: boolean }[]
}

export interface UpdateTaskPayload {
  title?: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  dueDate?: string | null
  categoryId?: string | null
}

export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  const { data } = await api.get<{ success: boolean; data: Task[] }>('/tasks', {
    params: filters,
  })
  return data.data
}

export async function fetchTask(id: string): Promise<Task> {
  const { data } = await api.get<{ success: boolean; data: Task }>(`/tasks/${id}`)
  return data.data
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const { data } = await api.post<{ success: boolean; data: Task }>('/tasks', payload)
  return data.data
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const { data } = await api.patch<{ success: boolean; data: Task }>(`/tasks/${id}`, payload)
  return data.data
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  const { data } = await api.delete<{ success: boolean; data: { id: string } }>(`/tasks/${id}`)
  return data.data
}
