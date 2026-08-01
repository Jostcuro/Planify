import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { CalendarDays, ListChecks, Pencil } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatDate,
  getCategoryStyle,
  isOverdue,
  isToday,
  PRIORITY_BADGE,
  PRIORITY_LABELS,
} from '@/lib/format'
import { subtaskProgress } from '@/lib/kanban'
import { cn } from '@/lib/utils'
import type { Category, Task } from '@/types'

interface KanbanCardContentProps {
  task: Task
  categories: Category[]
  dragging?: boolean
  onEdit?: (task: Task) => void
}

export function KanbanCardContent({ task, categories, dragging = false, onEdit }: KanbanCardContentProps) {
  const category = task.categoryId ? categories.find((item) => item.id === task.categoryId) : undefined
  const overdue = isOverdue(task.dueDate) && task.status !== 'COMPLETED'
  const today = isToday(task.dueDate)
  const { done, total } = subtaskProgress(task)
  const completed = task.status === 'COMPLETED'

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm',
        dragging && 'rotate-3 shadow-xl ring-2 ring-ring',
        completed && 'opacity-70',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className={cn('text-sm font-medium', completed && 'text-muted-foreground line-through')}>
          {task.title}
        </h4>
        {onEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 -mt-1 size-6 shrink-0"
            aria-label="Editar tarea"
            onClick={(event) => {
              event.stopPropagation()
              onEdit(task)
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Pencil className="size-3.5" />
          </Button>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge className={PRIORITY_BADGE[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
        {category ? (
          <Badge className="gap-1.5 border-transparent bg-secondary text-secondary-foreground">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: getCategoryStyle(category.color) }}
            />
            {category.name}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {task.dueDate ? (
          <span
            className={cn(
              'inline-flex items-center gap-1',
              overdue && 'font-medium text-destructive',
              today && 'font-medium text-amber-600',
            )}
          >
            <CalendarDays className="size-3.5" />
            {formatDate(task.dueDate)}
          </span>
        ) : null}
        {total > 0 ? (
          <span className="inline-flex items-center gap-1">
            <ListChecks className="size-3.5" />
            {done}/{total}
          </span>
        ) : null}
      </div>
    </div>
  )
}

interface KanbanCardProps {
  task: Task
  categories: Category[]
  onEdit: (task: Task) => void
}

export default function KanbanCard({ task, categories, onEdit }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'cursor-grab rounded-lg active:cursor-grabbing',
        isDragging && 'opacity-40',
      )}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-roledescription="tarea arrastrable"
      {...listeners}
    >
      <KanbanCardContent task={task} categories={categories} onEdit={onEdit} />
    </div>
  )
}
