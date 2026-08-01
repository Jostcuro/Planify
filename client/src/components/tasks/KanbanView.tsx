import { pointerWithin, DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { useMemo, useState } from 'react'

import { kanbanAccessibility, useKanbanSensors } from '@/components/tasks/dnd-config'
import { KanbanCardContent } from '@/components/tasks/KanbanCard'
import KanbanColumn from '@/components/tasks/KanbanColumn'
import ErrorState from '@/components/ui/error-state'
import SkeletonKanban from '@/components/ui/skeleton-kanban'
import { useTasks } from '@/hooks/useTasks'
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus'
import { ALL_STATUSES } from '@/lib/format'
import { groupTasksByStatus, isValidStatus } from '@/lib/kanban'
import type { Category, Task, TaskFilters, TaskStatus } from '@/types'

interface KanbanViewProps {
  filters?: TaskFilters
  categories: Category[]
  onEdit: (task: Task) => void
}

function resolveTargetStatus(overId: unknown, overData: unknown): TaskStatus | null {
  if (isValidStatus(overId)) return overId
  const overTask = (overData as { current?: { task?: Task } } | undefined)?.current?.task
  return overTask ? overTask.status : null
}

export default function KanbanView({ filters, categories, onEdit }: KanbanViewProps) {
  const sensors = useKanbanSensors()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const { data: tasks, isLoading, isError, refetch } = useTasks(filters)
  const updateStatus = useUpdateTaskStatus()

  const groups = useMemo(() => groupTasksByStatus(tasks ?? []), [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask((event.active.data.current as { task?: Task } | undefined)?.task ?? null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const task = (event.active.data.current as { task?: Task } | undefined)?.task
    if (task) {
      const targetStatus = resolveTargetStatus(event.over?.id, event.over?.data)
      if (targetStatus && targetStatus !== task.status) {
        updateStatus.mutate({ id: task.id, status: targetStatus })
      }
    }
    setActiveTask(null)
  }

  const handleDragCancel = () => setActiveTask(null)

  return (
    <DndContext
      sensors={sensors}
      accessibility={kanbanAccessibility}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {isLoading ? <SkeletonKanban /> : null}

      {isError ? <ErrorState onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError ? (
        <div className="flex snap-x gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {ALL_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={groups[status]}
              categories={categories}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : null}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="w-72">
            <KanbanCardContent task={activeTask} categories={categories} dragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
