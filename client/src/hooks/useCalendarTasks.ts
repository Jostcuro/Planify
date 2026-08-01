import { useMemo } from 'react'

import { useTasks } from '@/hooks/useTasks'
import { filterUndated, groupTasksByDate } from '@/lib/calendar'

export function useCalendarTasks() {
  const query = useTasks({ sortBy: 'dueDate', order: 'asc' })

  const grouped = useMemo(() => groupTasksByDate(query.data ?? []), [query.data])
  const undated = useMemo(() => filterUndated(query.data ?? []), [query.data])

  return { ...query, grouped, undated }
}
