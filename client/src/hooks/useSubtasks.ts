import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/lib/api-error'
import { createSubtask, deleteSubtask, toggleSubtask } from '@/services/subtasks'
import type { CreateSubtaskPayload } from '@/services/subtasks'

function useInvalidateTask() {
  const queryClient = useQueryClient()
  return (taskId: string) => {
    queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }
}

export function useCreateSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: CreateSubtaskPayload }) =>
      createSubtask(taskId, payload),
    onSuccess: (_data, variables) => {
      invalidateTask(variables.taskId)
      toast.success('Subtarea añadida')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo añadir la subtarea'))
    },
  })
}

export function useToggleSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) =>
      toggleSubtask(taskId, subtaskId),
    onSuccess: (_data, variables) => invalidateTask(variables.taskId),
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo actualizar la subtarea'))
    },
  })
}

export function useDeleteSubtask() {
  const invalidateTask = useInvalidateTask()
  return useMutation({
    mutationFn: ({ taskId, subtaskId }: { taskId: string; subtaskId: string }) =>
      deleteSubtask(taskId, subtaskId),
    onSuccess: (_data, variables) => {
      invalidateTask(variables.taskId)
      toast.success('Subtarea eliminada')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'No se pudo eliminar la subtarea'))
    },
  })
}
