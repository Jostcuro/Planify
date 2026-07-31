import { CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { isOverdue, toDateKey, PRIORITY_BADGE } from '@/lib/format'
import type { Task } from '@/types'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default function CalendarPage() {
  const { data: tasks, isLoading, isError } = useTasks({ sortBy: 'dueDate', order: 'asc' })
  const [cursor, setCursor] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const { year, month, startOffset, daysInMonth, todayKey } = useMemo(() => {
    const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    return {
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      startOffset: (firstDay.getDay() + 6) % 7,
      daysInMonth: new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate(),
      todayKey: toDateKey(new Date()),
    }
  }, [cursor])

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>()
    for (const task of tasks ?? []) {
      if (!task.dueDate) continue
      const key = toDateKey(task.dueDate)
      const list = map.get(key)
      if (list) list.push(task)
      else map.set(key, [task])
    }
    return map
  }, [tasks])

  const undated = useMemo(() => (tasks ?? []).filter((task) => !task.dueDate), [tasks])

  const cells = useMemo(() => {
    const blanks = Array.from({ length: startOffset }, () => null as number | null)
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
    return [...blanks, ...days]
  }, [startOffset, daysInMonth])

  const monthLabel = capitalize(
    cursor.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
  )

  const moveMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Calendario</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tus tareas agrupadas por fecha límite.</p>
        </div>
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
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          No se pudieron cargar las tareas.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
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
                  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayTasks = grouped.get(dateKey) ?? []
                  const isToday = dateKey === todayKey
                  const isPast = dateKey < todayKey

                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        'min-h-24 rounded-md border p-1.5',
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
                        {dayTasks.slice(0, 3).map((task) => (
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
                        {dayTasks.length > 3 ? (
                          <div className="px-1 text-[11px] font-medium text-muted-foreground">
                            +{dayTasks.length - 3} más
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 text-sm font-semibold">Sin fecha límite</h2>
              {undated.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
                  <CalendarOff className="size-6" />
                  <p className="text-sm">No hay tareas sin fecha.</p>
                </div>
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
