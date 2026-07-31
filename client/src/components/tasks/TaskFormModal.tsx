import { Loader2, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import { ALL_PRIORITIES, ALL_STATUSES, dateInputToIso, PRIORITY_LABELS, STATUS_LABELS, toDateKey } from '@/lib/format'
import type { Category, Task } from '@/types'

interface TaskFormModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  task?: Task | null
}

interface FormState {
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  dueDate: string
  categoryId: string
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
  categoryId: '',
}

function toFormState(task: Task): FormState {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? toDateKey(task.dueDate) : '',
    categoryId: task.categoryId ?? '',
  }
}

export default function TaskFormModal({ open, onClose, categories, task }: TaskFormModalProps) {
  const isEdit = Boolean(task)
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [subtasks, setSubtasks] = useState<string[]>([''])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setForm(task ? toFormState(task) : EMPTY_FORM)
    setSubtasks([''])
    setError(null)
  }, [open, task])

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async () => {
    setError(null)
    const title = form.title.trim()
    if (!title) {
      setError('El título es obligatorio')
      return
    }

    const payload = {
      title,
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: dateInputToIso(form.dueDate),
      categoryId: form.categoryId || null,
    }

    try {
      if (isEdit && task) {
        await updateTaskMutation.mutateAsync({ id: task.id, payload })
      } else {
        const subtaskTitles = subtasks.map((title) => title.trim()).filter(Boolean)
        await createTaskMutation.mutateAsync({
          ...payload,
          subtasks: subtaskTitles.length ? subtaskTitles.map((title) => ({ title })) : undefined,
        })
      }
      onClose()
    } catch {
      setError('No se pudo guardar la tarea. Inténtalo de nuevo.')
    }
  }

  const updateSubtask = (index: number, value: string) => {
    setSubtasks((current) => current.map((item, i) => (i === index ? value : item)))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Editar tarea' : 'Nueva tarea'}
      description={isEdit ? 'Actualiza los datos de la tarea' : 'Crea una tarea con categoría, prioridad y subtareas'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            {isEdit ? 'Guardar cambios' : 'Crear tarea'}
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit()
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="task-title">Título *</Label>
          <Input
            id="task-title"
            value={form.title}
            maxLength={200}
            onChange={(event) => setField('title', event.target.value)}
            placeholder="¿Qué hay que hacer?"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="task-description">Descripción</Label>
          <Textarea
            id="task-description"
            value={form.description}
            maxLength={1000}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Detalles opcionales de la tarea…"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="task-status">Estado</Label>
            <Select
              id="task-status"
              value={form.status}
              onChange={(event) => setField('status', event.target.value as Task['status'])}
            >
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="task-priority">Prioridad</Label>
            <Select
              id="task-priority"
              value={form.priority}
              onChange={(event) => setField('priority', event.target.value as Task['priority'])}
            >
              {ALL_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="task-due-date">Fecha límite</Label>
            <Input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(event) => setField('dueDate', event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="task-category">Categoría</Label>
            <Select
              id="task-category"
              value={form.categoryId}
              onChange={(event) => setField('categoryId', event.target.value)}
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {!isEdit ? (
          <div className="space-y-2">
            <Label>Subtareas</Label>
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={subtask}
                  maxLength={200}
                  onChange={(event) => updateSubtask(index, event.target.value)}
                  placeholder={`Subtarea ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSubtasks((current) => current.filter((_, i) => i !== index))}
                  aria-label="Quitar subtarea"
                  disabled={subtasks.length === 1}
                >
                  <X />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubtasks((current) => [...current, ''])}
              disabled={subtasks.length >= 20}
            >
              <Plus />
              Añadir subtarea
            </Button>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>
    </Modal>
  )
}
