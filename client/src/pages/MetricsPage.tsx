import { AlertTriangle, CalendarClock } from 'lucide-react'

import BarRow from '@/components/metrics/BarRow'
import MetricCard from '@/components/metrics/MetricCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useMetrics } from '@/hooks/useMetrics'
import { cn } from '@/lib/utils'
import {
  formatDate,
  getCategoryStyle,
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/lib/format'
import type { TaskPriority, TaskStatus } from '@/types'

const STATUS_BAR_COLORS: Record<TaskStatus, string> = {
  BACKLOG: '#94a3b8',
  TODO: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  IN_REVIEW: '#8b5cf6',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
}

const PRIORITY_BAR_COLORS: Record<TaskPriority, string> = {
  LOW: '#94a3b8',
  MEDIUM: '#3b82f6',
  HIGH: '#f97316',
  URGENT: '#ef4444',
}

function weekdayLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { weekday: 'short' })
}

export default function MetricsPage() {
  const { data: metrics, isLoading, isError, refetch } = useMetrics()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Métricas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Resumen del rendimiento de tus tareas.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (isError || !metrics) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
        <AlertTriangle className="size-8 text-destructive" />
        <p className="text-muted-foreground">No se pudieron cargar las métricas.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  const { overview } = metrics
  const completionPercent = Math.round(overview.completionRate * 100)
  const maxStatus = Math.max(...metrics.byStatus.map((item) => item.count), 1)
  const maxPriority = Math.max(...metrics.byPriority.map((item) => item.count), 1)
  const maxCategory = Math.max(...metrics.byCategory.map((item) => item.count), 1)
  const maxWeekly = Math.max(...metrics.weeklyCompletion.map((item) => item.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumen del rendimiento de tus tareas.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Total de tareas" value={overview.totalTasks} />
        <MetricCard label="Completadas" value={overview.completedTasks} accent="success" />
        <MetricCard label="Pendientes" value={overview.pendingTasks} />
        <MetricCard label="Tasa de completado" value={`${completionPercent}%`} />
        <MetricCard label="Vencidas" value={overview.overdueTasks} accent={overview.overdueTasks > 0 ? 'danger' : 'default'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completadas por día (últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-end justify-between gap-2">
            {metrics.weeklyCompletion.map((day) => (
              <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs font-medium">{day.count}</span>
                <div
                  className={cn('w-full max-w-10 rounded-t-md bg-primary', day.count === 0 && 'bg-muted')}
                  style={{ height: day.count === 0 ? '4px' : `${Math.round((day.count / maxWeekly) * 100)}%` }}
                />
                <span className="text-[11px] text-muted-foreground">{weekdayLabel(day.date)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.byStatus.map((item) => (
              <BarRow
                key={item.status}
                label={STATUS_LABELS[item.status]}
                value={item.count}
                max={maxStatus}
                color={STATUS_BAR_COLORS[item.status]}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.byPriority.map((item) => (
              <BarRow
                key={item.priority}
                label={PRIORITY_LABELS[item.priority]}
                value={item.count}
                max={maxPriority}
                color={PRIORITY_BAR_COLORS[item.priority]}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por categoría</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.byCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay datos por categoría todavía.</p>
            ) : (
              metrics.byCategory.map((item) => (
                <BarRow
                  key={item.categoryId ?? 'none'}
                  label={item.name}
                  value={item.count}
                  max={maxCategory}
                  color={getCategoryStyle(item.color)}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas fechas límite</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.upcomingDeadlines.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
                <CalendarClock className="size-6" />
                <p className="text-sm">No hay tareas con fecha límite próxima.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {metrics.upcomingDeadlines.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 rounded-md border p-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        {task.category ? (
                          <>
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: getCategoryStyle(task.category.color) }}
                            />
                            {task.category.name}
                          </>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="size-3" />
                          {formatDate(task.dueDate)}
                        </span>
                      </p>
                    </div>
                    <Badge className={PRIORITY_BADGE[task.priority]}>
                      {PRIORITY_LABELS[task.priority]}
                    </Badge>
                    <Badge className="hidden sm:inline-flex">{STATUS_LABELS[task.status]}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
