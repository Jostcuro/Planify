import { Check, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Modal from '@/components/ui/modal'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories'
import type { Category } from '@/types'

interface CategoryManagerProps {
  open: boolean
  onClose: () => void
}

const DEFAULT_COLOR = '#3b82f6'

export default function CategoryManager({ open, onClose }: CategoryManagerProps) {
  const { data: categories, isLoading, isError } = useCategories()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(DEFAULT_COLOR)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState(DEFAULT_COLOR)
  const [error, setError] = useState<string | null>(null)

  const resetNewForm = () => {
    setNewName('')
    setNewColor(DEFAULT_COLOR)
    setError(null)
  }

  const handleCreate = async () => {
    setError(null)
    const name = newName.trim()
    if (!name) {
      setError('El nombre es obligatorio')
      return
    }
    try {
      await createCategoryMutation.mutateAsync({ name, color: newColor })
      resetNewForm()
    } catch {
      setError('No se pudo crear la categoría.')
    }
  }

  const startEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditColor(category.color)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setError(null)
    const name = editName.trim()
    if (!name) {
      setError('El nombre es obligatorio')
      return
    }
    try {
      await updateCategoryMutation.mutateAsync({ id: editingId, payload: { name, color: editColor } })
      setEditingId(null)
    } catch {
      setError('No se pudo guardar la categoría.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Categorías"
      description="Organiza tus tareas por categorías con un color identificativo"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border p-3">
          <Label htmlFor="new-category-name">Nueva categoría</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="new-category-name"
              value={newName}
              maxLength={50}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Nombre de la categoría"
            />
            <input
              type="color"
              value={newColor}
              onChange={(event) => setNewColor(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
              aria-label="Color de la categoría"
            />
            <Button
              onClick={() => void handleCreate()}
              disabled={!newName.trim() || createCategoryMutation.isPending}
              aria-label="Crear categoría"
            >
              {createCategoryMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        ) : null}

        {isError ? (
          <p className="text-sm text-destructive">No se pudieron cargar las categorías.</p>
        ) : null}

        {!isLoading && !isError && categories && categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no tienes categorías. Crea la primera.</p>
        ) : null}

        <ul className="space-y-2">
          {(categories ?? []).map((category) => (
            <li key={category.id} className="flex items-center gap-2 rounded-md border p-2">
              {editingId === category.id ? (
                <>
                  <input
                    type="color"
                    value={editColor}
                    onChange={(event) => setEditColor(event.target.value)}
                    className="h-8 w-10 cursor-pointer rounded-md border border-input bg-transparent"
                    aria-label="Cambiar color"
                  />
                  <Input
                    value={editName}
                    maxLength={50}
                    onChange={(event) => setEditName(event.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void handleSaveEdit()}
                    disabled={updateCategoryMutation.isPending}
                    aria-label="Guardar cambios"
                  >
                    <Check />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} aria-label="Cancelar edición">
                    <X />
                  </Button>
                </>
              ) : (
                <>
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1 text-sm">{category.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(category)} aria-label="Editar categoría">
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm(`¿Eliminar la categoría "${category.name}"?`)) {
                        void deleteCategoryMutation.mutateAsync(category.id)
                      }
                    }}
                    aria-label="Eliminar categoría"
                  >
                    <Trash2 />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
