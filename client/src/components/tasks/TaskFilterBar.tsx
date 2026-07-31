import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { ALL_PRIORITIES, ALL_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/format'
import type { Category } from '@/types'

export interface TaskFilterBarValue {
  search: string
  status: string
  priority: string
  categoryId: string
}

interface TaskFilterBarProps {
  categories: Category[]
  value: TaskFilterBarValue
  onChange: (value: TaskFilterBarValue) => void
}

export default function TaskFilterBar({ categories, value, onChange }: TaskFilterBarProps) {
  const update = (patch: Partial<TaskFilterBarValue>) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1">
        <Label htmlFor="task-search">Buscar</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="task-search"
            className="pl-9"
            placeholder="Buscar por título o descripción…"
            value={value.search}
            onChange={(event) => update({ search: event.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="filter-status">Estado</Label>
        <Select
          id="filter-status"
          value={value.status}
          onChange={(event) => update({ status: event.target.value })}
        >
          <option value="">Todos</option>
          {ALL_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="filter-priority">Prioridad</Label>
        <Select
          id="filter-priority"
          value={value.priority}
          onChange={(event) => update({ priority: event.target.value })}
        >
          <option value="">Todas</option>
          {ALL_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="filter-category">Categoría</Label>
        <Select
          id="filter-category"
          value={value.categoryId}
          onChange={(event) => update({ categoryId: event.target.value })}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
