import { CalendarDays, CalendarOff, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import CalendarDay from '@/components/calendar/CalendarDay'
import EmptyState from '@/components/ui/empty-state'
import ErrorState from '@/components/ui/error-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCalendarGrid, getDateKey, getMonthLabel, WEEKDAYS } from '@/lib/calendar'
import { PRIORITY_BADGE, PRIORITY_LABELS, toDateKey } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

interface CalendarViewProps {
  grouped: Map<string, Task[]>
  undated: Task[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onCreateTask: (dateKey: string) => void
}

export default function CalendarView({
  grouped,
  undated,
  isLoading,
  isError,
  onRetry,
  onCreateTask,
}: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const { year, month, cells } = useMemo(
    () => getCalendarGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  )
  const todayKey = toDateKey(new Date())
  const monthLabel = getMonthLabel(year, month)
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthHasTasks = useMemo(() => {
    for (const key of grouped.keys()) {
      if (key.startsWith(monthPrefix)) return true
    }
    return false
  }, [grouped, monthPrefix])

  const moveMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => moveMonth(-1)} aria-label="Mes anterior">
            <ChevronLeft />
          </Button>
          <span className="min-w-36 text-center text-sm font-medium">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={() => moveMonth(1)} aria-label="Mes siguiente">
            <ChevronRight />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Hoy
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="mr-1">Prioridades:</span>
          {(Object.keys(PRIORITY_LABELS) as (keyof typeof PRIORITY_LABELS)[]).map((priority) => (
            <Badge key={priority} className={cn(PRIORITY_BADGE[priority], 'px-1.5')}>
              {PRIORITY_LABELS[priority]}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : null}

      {isError ? <ErrorState onRetry={onRetry} /> : null}

      {!isLoading && !isError ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {monthHasTasks ? (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                  {WEEKDAYS.map((weekday) => (
                    <div key={weekday} className="py-1">
                      {weekday}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, index) => {
                    if (day === null) return <div key={`blank-${index}`} />
                    const dateKey = getDateKey(year, month, day)
                    const dayTasks = grouped.get(dateKey) ?? []
                    const isToday = dateKey === todayKey
                    const isPast = dateKey < todayKey

                    return (
                      <CalendarDay
                        key={dateKey}
                        day={day}
                        dateKey={dateKey}
                        tasks={dayTasks}
                        isToday={isToday}
                        isPast={isPast}
                        onCreateTask={onCreateTask}
                      />
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No hay tareas con fecha límite este mes."
              description="Crea una tarea para cualquier día pulsando su fecha en el calendario."
              action={
                <Button onClick={() => onCreateTask(todayKey)}>
                  <Plus />
                  Nueva tarea
                </Button>
              }
              className="rounded-lg border border-dashed p-10"
            />
          )}

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 text-sm font-semibold">Sin fecha límite</h2>
              {undated.length === 0 ? (
                <EmptyState icon={CalendarOff} title="No hay tareas sin fecha." className="py-6" />
              ) : (
                <ul className="space-y-2">
                  {undated.map((task) => (
                    <li key={task.id} className="flex items-center gap-2 rounded-md border p-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{task.title}</p>
                      </div>
                      <Badge className={cn(PRIORITY_BADGE[task.priority], 'shrink-0')}>
                        {task.priority}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
