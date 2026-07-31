import { AlertTriangle, ClipboardList, FolderPlus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import CategoryManager from '@/components/categories/CategoryManager'
import TaskCard from '@/components/tasks/TaskCard'
import TaskFilterBar, { FILTER_ALL, type TaskFilterBarValue } from '@/components/tasks/TaskFilterBar'
import TaskFormModal from '@/components/tasks/TaskFormModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import { useTasks } from '@/hooks/useTasks'
import { isOverdue } from '@/lib/format'
import type { Task, TaskFilters, TaskPriority, TaskStatus } from '@/types'

const INITIAL_FILTERS: TaskFilterBarValue = {
  search: '',
  status: FILTER_ALL,
  priority: FILTER_ALL,
  categoryId: FILTER_ALL,
}

export default function DashboardPage() {
  const [filters, setFilters] = useState<TaskFilterBarValue>(INITIAL_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  const { data: categories } = useCategories()
  const queryFilters = useMemo<TaskFilters>(() => {
    const value: TaskFilters = {
      sortBy: 'dueDate',
      order: 'asc',
    }
    if (filters.status !== FILTER_ALL) value.status = [filters.status as TaskStatus]
    if (filters.priority !== FILTER_ALL) value.priority = [filters.priority as TaskPriority]
    if (filters.categoryId !== FILTER_ALL) value.categoryId = filters.categoryId
    if (filters.search.trim()) value.search = filters.search.trim()
    return value
  }, [filters])

  const { data: tasks, isLoading, isError, refetch } = useTasks(queryFilters)

  const summary = useMemo(() => {
    const list = tasks ?? []
    const pending = list.filter((task) => task.status !== 'COMPLETED' && task.status !== 'CANCELLED').length
    const overdue = list.filter(
      (task) => task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && isOverdue(task.dueDate),
    ).length
    return { total: list.length, pending, overdue }
  }, [tasks])

  const openCreate = () => {
    setEditingTask(null)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status !== FILTER_ALL ||
      filters.priority !== FILTER_ALL ||
      filters.categoryId !== FILTER_ALL,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mis tareas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organiza tu trabajo por prioridad, categoría y fecha límite.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCategoriesOpen(true)}>
            <FolderPlus />
            Categorías
          </Button>
          <Button onClick={openCreate}>
            <Plus />
            Nueva tarea
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <TaskFilterBar
            categories={categories ?? []}
            value={filters}
            onChange={setFilters}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-md border bg-muted px-3 py-1">
          <span className="font-semibold">{summary.total}</span> tareas
        </span>
        <span className="rounded-md border bg-muted px-3 py-1">
          <span className="font-semibold">{summary.pending}</span> pendientes
        </span>
        {summary.overdue > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-700">
            <AlertTriangle className="size-4" />
            {summary.overdue} vencidas
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-2/3" />
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="text-muted-foreground">No se pudieron cargar las tareas.</p>
          <Button variant="outline" onClick={() => void refetch()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && tasks && tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <ClipboardList className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No hay tareas que coincidan con los filtros.' : 'Todavía no tienes tareas.'}
          </p>
          {!hasActiveFilters ? (
            <Button onClick={openCreate}>
              <Plus />
              Crear tu primera tarea
            </Button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !isError && tasks && tasks.length > 0 ? (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} categories={categories ?? []} onEdit={openEdit} />
          ))}
        </div>
      ) : null}

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories ?? []}
        task={editingTask}
      />

      <CategoryManager open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </div>
  )
}
