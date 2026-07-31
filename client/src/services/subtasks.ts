import type { Subtask } from '@/types'
import { api } from '@/services/api'

export interface CreateSubtaskPayload {
  title: string
  completed?: boolean
}

export async function createSubtask(taskId: string, payload: CreateSubtaskPayload): Promise<Subtask> {
  const { data } = await api.post<{ success: boolean; data: Subtask }>(
    `/tasks/${taskId}/subtasks`,
    payload,
  )
  return data.data
}

export async function toggleSubtask(taskId: string, subtaskId: string): Promise<Subtask> {
  const { data } = await api.patch<{ success: boolean; data: Subtask }>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
  )
  return data.data
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<{ id: string }> {
  const { data } = await api.delete<{ success: boolean; data: { id: string } }>(
    `/tasks/${taskId}/subtasks/${subtaskId}`,
  )
  return data.data
}
