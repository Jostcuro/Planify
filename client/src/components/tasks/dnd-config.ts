import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Active,
  type Announcements,
  type Over,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { STATUS_LABELS } from '@/lib/format'
import { isValidStatus } from '@/lib/kanban'

type AnnouncementArgs = { active: Active; over: Over | null }

function taskTitle(active: Active): string {
  return active.data.current?.task?.title ?? 'la tarea'
}

function columnLabel(status: unknown): string {
  return isValidStatus(status) ? STATUS_LABELS[status] : 'desconocida'
}

export const kanbanAccessibility: { announcements: Announcements } = {
  announcements: {
    onDragStart({ active }: Pick<AnnouncementArgs, 'active'>) {
      return `Tarea "${taskTitle(active)}" levantada en la columna ${columnLabel(active.data.current?.task?.status)}.`
    },
    onDragOver({ active, over }: AnnouncementArgs) {
      return `Tarea "${taskTitle(active)}" sobre la columna ${columnLabel(over?.id)}.`
    },
    onDragEnd({ active, over }: AnnouncementArgs) {
      const from = columnLabel(active.data.current?.task?.status)
      const to = isValidStatus(over?.id) ? STATUS_LABELS[over?.id] : null
      return to
        ? `Tarea "${taskTitle(active)}" soltada en la columna ${to} (desde ${from}).`
        : `Tarea "${taskTitle(active)}" devuelta a la columna ${from}.`
    },
    onDragCancel({ active }: AnnouncementArgs) {
      return `Movimiento de la tarea "${taskTitle(active)}" cancelado.`
    },
  },
}

export function useKanbanSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
}
