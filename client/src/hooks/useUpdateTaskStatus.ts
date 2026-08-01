import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateTask } from '@/services/tasks'
import type { Task, TaskStatus } from '@/types'

interface UpdateTaskStatusInput {
  id: string
  status: TaskStatus
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateTaskStatusInput) => updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const snapshot = queryClient.getQueriesData({ queryKey: ['tasks'] })

      queryClient.setQueriesData<unknown[] | undefined>(
        { queryKey: ['tasks'] },
        (tasks) => {
          if (!tasks) return tasks
          return tasks.map((task) => (task as Task).id === id ? { ...(task as Task), status } : task)
        },
      )

      return { snapshot }
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        for (const [key, data] of context.snapshot) {
          queryClient.setQueryData(key as QueryKey, data)
        }
      }
      toast.error('No se pudo actualizar el estado de la tarea')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}
