import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
} from 'lucide-react'

import CategoryChart from '@/components/metrics/CategoryChart'
import KpiCard from '@/components/metrics/KpiCard'
import StatusChart from '@/components/metrics/StatusChart'
import WeeklyChart from '@/components/metrics/WeeklyChart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/ui/empty-state'
import ErrorState from '@/components/ui/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  formatDate,
  getCategoryStyle,
  PRIORITY_BADGE,
  PRIORITY_BAR_COLORS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '@/lib/format'
import { TASK_PRIORITIES, type MetricsResponse } from '@/types'

interface MetricsViewProps {
  metrics: MetricsResponse | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export default function MetricsView({ metrics, isLoading, isError, onRetry }: MetricsViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
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
    return <ErrorState onRetry={onRetry} />
  }

  const { overview } = metrics
  const completionPercent = Math.round(overview.completionRate * 100)
  const priorityCounts = new Map(metrics.byPriority.map((item) => [item.priority, item.count]))

  if (overview.totalTasks === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Todavía no tienes tareas para ver métricas."
        description="Crea tu primera tarea para empezar."
        className="rounded-lg border border-dashed p-10"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total de tareas" value={overview.totalTasks} icon={ListTodo} />
        <KpiCard label="Completadas" value={overview.completedTasks} icon={CheckCircle2} accent="success" />
        <KpiCard label="Pendientes" value={overview.pendingTasks} icon={Clock3} />
        <KpiCard label="Tasa de completado" value={`${completionPercent}%`} icon={TrendingUp} />
        <KpiCard
          label="Vencidas"
          value={overview.overdueTasks}
          icon={AlertTriangle}
          accent={overview.overdueTasks > 0 ? 'danger' : 'default'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completadas por día (últimos 7 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart data={metrics.weeklyCompletion} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={metrics.byStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.byCategory.length === 0 ? (
              <EmptyState title="No hay datos por categoría todavía." className="py-6" />
            ) : (
              <CategoryChart data={metrics.byCategory} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TASK_PRIORITIES.map((priority) => (
              <div key={priority} className="flex items-center gap-3">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PRIORITY_BAR_COLORS[priority] }}
                />
                <span className="flex-1 text-sm">{PRIORITY_LABELS[priority]}</span>
                <span className="text-sm font-medium">{priorityCounts.get(priority) ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas fechas límite</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.upcomingDeadlines.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No hay tareas con fecha límite próxima."
                className="py-6"
              />
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
