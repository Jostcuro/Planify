import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Loader2, Plus, X } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { dateObjectToIso, formatDate, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/format'
import { taskFormSchema, TASK_PRIORITIES, TASK_STATUSES, type TaskFormValues } from '@/lib/validations/task-form'
import type { Category, Task } from '@/types'

const CATEGORY_NONE = '__none__'

interface TaskFormModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  task?: Task | null
  initialDueDate?: Date | null
}

export function toDefaults(
  task: Task | null | undefined,
  initialDueDate?: Date | null,
): TaskFormValues {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'MEDIUM',
    status: task?.status ?? 'TODO',
    dueDate: task ? (task.dueDate ? new Date(task.dueDate) : null) : (initialDueDate ?? null),
    categoryId: task?.categoryId ?? null,
    subtasks: [],
  }
}

export default function TaskFormModal({ open, onClose, categories, task, initialDueDate }: TaskFormModalProps) {
  const isEdit = Boolean(task)
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: toDefaults(task, initialDueDate),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  })

  useEffect(() => {
    if (open) {
      reset(toDefaults(task, initialDueDate))
    }
  }, [open, task, initialDueDate, reset])

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending

  const addSubtask = () => {
    if (fields.length < 20) append({ title: '' })
  }

  const onSubmit = async (values: TaskFormValues) => {
    const subtaskTitles = values.subtasks
      .map((subtask) => subtask.title.trim())
      .filter(Boolean)

    try {
      if (isEdit && task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          payload: {
            title: values.title,
            description: values.description || undefined,
            status: values.status,
            priority: values.priority,
            dueDate: values.dueDate ? dateObjectToIso(values.dueDate) : null,
            categoryId: values.categoryId,
          },
        })
      } else {
        await createTaskMutation.mutateAsync({
          title: values.title,
          description: values.description || undefined,
          status: values.status,
          priority: values.priority,
          dueDate: values.dueDate ? dateObjectToIso(values.dueDate) : null,
          categoryId: values.categoryId,
          subtasks: subtaskTitles.length ? subtaskTitles.map((title) => ({ title })) : undefined,
        })
      }
      onClose()
    } catch {
      // el feedback de error se muestra desde el hook de mutación
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Actualiza los datos de la tarea.' : 'Crea una tarea con categoría, prioridad y subtareas.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Título *</Label>
            <Input
              id="task-title"
              placeholder="¿Qué hay que hacer?"
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
            {errors.title ? <p className="text-sm text-destructive">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-description">Descripción</Label>
            <Textarea
              id="task-description"
              placeholder="Detalles opcionales de la tarea…"
              aria-invalid={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? CATEGORY_NONE}
                    onValueChange={(value) =>
                      field.onChange(value === CATEGORY_NONE ? null : value)
                    }
                  >
                    <SelectTrigger id="task-category">
                      <SelectValue placeholder="Sin categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CATEGORY_NONE}>Sin categoría</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Prioridad</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="task-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {PRIORITY_LABELS[priority]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {isEdit ? (
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="task-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : null}

            <div className={cn('space-y-1.5', isEdit ? '' : 'col-span-2')}>
              <Label>Fecha límite</Label>
              <Controller
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? formatDate(field.value.toISOString()) : 'Selecciona una fecha'}
                        {field.value ? (
                          <span
                            className="ml-auto rounded-sm px-1 text-muted-foreground hover:bg-muted"
                            onClick={(event) => {
                              event.stopPropagation()
                              field.onChange(null)
                            }}
                            role="button"
                            aria-label="Quitar fecha"
                          >
                            <X className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(day) => field.onChange(day ?? null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          {!isEdit ? (
            <div className="space-y-2">
              <Label>Subtareas</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Subtarea ${index + 1}`}
                    aria-label={`Subtarea ${index + 1}`}
                    {...register(`subtasks.${index}.title`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Quitar subtarea"
                    disabled={fields.length === 1}
                  >
                    <X />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubtask}
                disabled={fields.length >= 20}
              >
                <Plus />
                Añadir subtarea
              </Button>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
