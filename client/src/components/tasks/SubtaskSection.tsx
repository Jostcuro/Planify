import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useCreateSubtask, useDeleteSubtask, useToggleSubtask } from '@/hooks/useSubtasks'
import { useTask } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'

interface SubtaskSectionProps {
  taskId: string
}

export default function SubtaskSection({ taskId }: SubtaskSectionProps) {
  const { data: task, isLoading, isError } = useTask(taskId)
  const createSubtaskMutation = useCreateSubtask()
  const toggleSubtaskMutation = useToggleSubtask()
  const deleteSubtaskMutation = useDeleteSubtask()
  const [newTitle, setNewTitle] = useState('')

  const subtasks = task?.subtasks ?? []
  const completedCount = subtasks.filter((subtask) => subtask.completed).length

  const handleAdd = async () => {
    const title = newTitle.trim()
    if (!title) return
    try {
      await createSubtaskMutation.mutateAsync({ taskId, payload: { title } })
      setNewTitle('')
    } catch {
      // el feedback de error se muestra desde el hook de mutación
    }
  }

  return (
    <div className="space-y-2 border-t pt-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {subtasks.length > 0
            ? `${completedCount} de ${subtasks.length} subtareas completadas`
            : 'Subtareas'}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      ) : null}

      {isError ? <p className="text-sm text-destructive">No se pudieron cargar las subtareas.</p> : null}

      {!isLoading && !isError && subtasks.length > 0 ? (
        <ul className="space-y-1">
          {subtasks.map((subtask) => (
            <li key={subtask.id} className="group flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => toggleSubtaskMutation.mutate({ taskId, subtaskId: subtask.id })}
                className="size-4 rounded border-input accent-primary"
              />
              <span
                className={cn(
                  'flex-1 text-sm',
                  subtask.completed && 'text-muted-foreground line-through',
                )}
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => deleteSubtaskMutation.mutate({ taskId, subtaskId: subtask.id })}
                aria-label="Eliminar subtarea"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center gap-2">
        <Input
          value={newTitle}
          maxLength={200}
          onChange={(event) => setNewTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              void handleAdd()
            }
          }}
          placeholder="Nueva subtarea…"
        />
        <Button
          size="icon"
          onClick={() => void handleAdd()}
          disabled={!newTitle.trim() || createSubtaskMutation.isPending}
          aria-label="Añadir subtarea"
        >
          {createSubtaskMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
        </Button>
      </div>
    </div>
  )
}
