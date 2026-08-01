import { Plus } from 'lucide-react'
import { useState } from 'react'

import CalendarView from '@/components/calendar/CalendarView'
import TaskFormModal from '@/components/tasks/TaskFormModal'
import { Button } from '@/components/ui/button'
import { useCalendarTasks } from '@/hooks/useCalendarTasks'
import { useCategories } from '@/hooks/useCategories'

export default function CalendarPage() {
  const { grouped, undated, isLoading, isError, refetch } = useCalendarTasks()
  const { data: categories } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [initialDueDate, setInitialDueDate] = useState<Date | null>(null)

  const openCreate = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number)
    setInitialDueDate(new Date(year, month - 1, day, 12, 0, 0))
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Calendario</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tus tareas agrupadas por fecha límite.</p>
        </div>
        <Button
          onClick={() => {
            setInitialDueDate(null)
            setFormOpen(true)
          }}
        >
          <Plus />
          Nueva tarea
        </Button>
      </div>

      <CalendarView
        grouped={grouped}
        undated={undated}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        onCreateTask={openCreate}
      />

      <TaskFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        categories={categories ?? []}
        initialDueDate={initialDueDate}
      />
    </div>
  )
}
