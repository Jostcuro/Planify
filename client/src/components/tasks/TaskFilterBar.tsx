import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ALL_PRIORITIES, ALL_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/format'
import type { Category, TaskPriority, TaskStatus } from '@/types'

export const FILTER_ALL = 'all'

export interface TaskFilterBarValue {
  search: string
  status: string
  priority: string
  categoryId: string
}

interface FilterSelectProps {
  id: string
  label: string
  value: string
  placeholder: string
  items: { value: string; label: string }[]
  onValueChange: (value: string) => void
}

function FilterSelect({ id, label, value, placeholder, items, onValueChange }: FilterSelectProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="min-w-40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FILTER_ALL}>{placeholder}</SelectItem>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
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
      <FilterSelect
        id="filter-status"
        label="Estado"
        value={value.status}
        placeholder="Todos"
        items={ALL_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status as TaskStatus] }))}
        onValueChange={(status) => update({ status })}
      />
      <FilterSelect
        id="filter-priority"
        label="Prioridad"
        value={value.priority}
        placeholder="Todas"
        items={ALL_PRIORITIES.map((priority) => ({
          value: priority,
          label: PRIORITY_LABELS[priority as TaskPriority],
        }))}
        onValueChange={(priority) => update({ priority })}
      />
      <FilterSelect
        id="filter-category"
        label="Categoría"
        value={value.categoryId}
        placeholder="Todas"
        items={categories.map((category) => ({ value: category.id, label: category.name }))}
        onValueChange={(categoryId) => update({ categoryId })}
      />
    </div>
  )
}
