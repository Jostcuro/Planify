import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createSubtask, deleteSubtask, toggleSubtask } from '@/services/subtasks'
import type { CreateSubtaskPayload } from '@/services/subtasks'

function useInvalidateTask() {
  const queryClient = useQueryClient()
  return (taskId: string) => {
    queryClient.invalidateQueries({ queryKey: ['task', taskId] })
  }
}

export function useCreateSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: CreateSubtaskPayload }) =>
      createSubtask(taskId, payload),
    onSuccess: (_data, variables) => invalidateTask(variables.taskId),
  })
}

export function useToggleSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) =>
      toggleSubtask(taskId, subtaskId),
    onSuccess: (_data, variables) => invalidateTask(variables.taskId),
  })
}

export function useDeleteSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) =>
      deleteSubtask(taskId, subtaskId),
    onSuccess: (_data, variables) => invalidateTask(variables.taskId),
  })
}
