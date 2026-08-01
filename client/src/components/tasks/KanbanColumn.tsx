import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import KanbanCard from '@/components/tasks/KanbanCard'
import { STATUS_LABELS } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Category, Task, TaskStatus } from '@/types'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  categories: Category[]
  onEdit: (task: Task) => void
}

const COLUMN_DOT: Record<TaskStatus, string> = {
  BACKLOG: 'bg-slate-400',
  TODO: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  IN_REVIEW: 'bg-violet-500',
  COMPLETED: 'bg-emerald-500',
  CANCELLED: 'bg-red-500',
}

export default function KanbanColumn({ status, tasks, categories, onEdit }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      aria-label={`Columna ${STATUS_LABELS[status]}`}
      className={cn(
        'flex h-[calc(100vh-200px)] w-72 min-w-0 shrink-0 snap-start flex-col rounded-lg border bg-muted/40 transition-colors lg:w-auto',
        isOver && 'border-primary bg-primary/5 ring-2 ring-primary/20',
      )}
    >
      <header className="flex items-center gap-2 px-3 py-2.5">
        <span className={cn('size-2.5 shrink-0 rounded-full', COLUMN_DOT[status])} aria-hidden="true" />
        <h3 className="truncate text-sm font-semibold">{STATUS_LABELS[status]}</h3>
        <span className="ml-auto rounded-full bg-muted-foreground/10 px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {tasks.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
            Sin tareas
          </div>
        ) : (
          <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <KanbanCard key={task.id} task={task} categories={categories} onEdit={onEdit} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </section>
  )
}
