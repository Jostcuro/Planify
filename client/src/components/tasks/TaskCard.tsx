import { CalendarDays, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import SubtaskSection from '@/components/tasks/SubtaskSection'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDeleteTask } from '@/hooks/useTasks'
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus'
import { cn } from '@/lib/utils'
import {
  formatDate,
  getCategoryStyle,
  isOverdue,
  isToday,
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  STATUS_BADGE,
  STATUS_LABELS,
} from '@/lib/format'
import { TASK_STATUSES, type Category, type Task } from '@/types'

interface TaskCardProps {
  task: Task
  categories: Category[]
  onEdit: (task: Task) => void
}

export default function TaskCard({ task, categories, onEdit }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const updateTaskStatusMutation = useUpdateTaskStatus()
  const deleteTaskMutation = useDeleteTask()

  const category = task.categoryId
    ? categories.find((item) => item.id === task.categoryId)
    : undefined

  const overdue = isOverdue(task.dueDate) && task.status !== 'COMPLETED'
  const today = isToday(task.dueDate)

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      setConfirmDelete(false)
    } catch {
      // el feedback de error se muestra desde el hook de mutación
    }
  }

  const subtitleCount = task.subtasks?.length ?? 0

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={STATUS_BADGE[task.status]}>{STATUS_LABELS[task.status]}</Badge>
            <Badge className={PRIORITY_BADGE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Editar tarea">
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)} aria-label="Eliminar tarea">
              <Trash2 />
            </Button>
          </div>
        </div>

        <h3 className={cn('mt-2 font-medium', task.status === 'COMPLETED' && 'text-muted-foreground line-through')}>
          {task.title}
        </h3>
        {task.description ? <p className="mt-1 text-sm text-muted-foreground">{task.description}</p> : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {category ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: getCategoryStyle(category.color) }}
              />
              {category.name}
            </span>
          ) : null}
          {task.dueDate ? (
            <span
              className={cn(
                'inline-flex items-center gap-1.5',
                overdue ? 'font-medium text-destructive' : today ? 'font-medium text-amber-600' : '',
              )}
            >
              <CalendarDays className="size-4" />
              {formatDate(task.dueDate)}
              {overdue ? ' · vencida' : today ? ' · hoy' : ''}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
          <Select
            value={task.status}
            onValueChange={(status) =>
              updateTaskStatusMutation.mutate({ id: task.id, status: status as Task['status'] })
            }
          >
            <SelectTrigger className="h-8 w-auto gap-1 text-xs" aria-label="Cambiar estado">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => setExpanded((current) => !current)}>
            {expanded ? <ChevronUp /> : <ChevronDown />}
            {subtitleCount > 0 ? `${subtitleCount} subtarea${subtitleCount === 1 ? '' : 's'}` : 'Subtareas'}
          </Button>
        </div>

        {expanded ? <SubtaskSection taskId={task.id} /> : null}
      </CardContent>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar tarea"
        description={`¿Eliminar la tarea "${task.title}"?`}
        confirmLabel="Eliminar"
        isPending={deleteTaskMutation.isPending}
        onConfirm={() => void handleDelete()}
        onClose={() => setConfirmDelete(false)}
      />
    </Card>
  )
}
