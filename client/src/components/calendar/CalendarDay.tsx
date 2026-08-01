import type { KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'
import { isOverdue } from '@/lib/format'
import type { Task } from '@/types'

interface CalendarDayProps {
  day: number
  dateKey: string
  tasks: Task[]
  isToday: boolean
  isPast: boolean
  onCreateTask: (dateKey: string) => void
}

export default function CalendarDay({
  day,
  dateKey,
  tasks,
  isToday,
  isPast,
  onCreateTask,
}: CalendarDayProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onCreateTask(dateKey)
    }
  }

  const label = new Date(`${dateKey}T12:00:00`).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Añadir tarea el ${label}`}
      onClick={() => onCreateTask(dateKey)}
      onKeyDown={handleKeyDown}
      className={cn(
        'group min-h-24 cursor-pointer rounded-md border p-1.5 transition-colors hover:border-primary/40',
        isToday ? 'border-primary bg-accent' : 'border-transparent',
      )}
    >
      <span
        className={cn(
          'inline-flex size-6 items-center justify-center rounded-full text-xs',
          isToday ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        {day}
      </span>
      <div className="mt-1 space-y-1">
        {tasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className={cn(
              'truncate rounded px-1 py-0.5 text-[11px] leading-tight',
              isPast && task.status !== 'COMPLETED' && isOverdue(task.dueDate)
                ? 'bg-red-100 text-red-700'
                : 'bg-muted text-foreground',
            )}
            title={task.title}
          >
            {task.title}
          </div>
        ))}
        {tasks.length > 3 ? (
          <div className="px-1 text-[11px] font-medium text-muted-foreground">
            +{tasks.length - 3} más
          </div>
        ) : null}
      </div>
    </div>
  )
}
