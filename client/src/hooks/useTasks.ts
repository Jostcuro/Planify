import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from '@/services/tasks'
import type { CreateTaskPayload, UpdateTaskPayload } from '@/services/tasks'
import type { TaskFilters } from '@/types'

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
  })
}

export function useTask(id: string, enabled = true) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
    },
  })
}
