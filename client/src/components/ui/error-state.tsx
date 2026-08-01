import { AlertTriangle, RotateCw } from 'lucide-react'

import EmptyState from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry: () => void
}

export default function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title ?? 'No se pudieron cargar los datos.'}
      description={description}
      action={
        <Button variant="outline" onClick={onRetry}>
          <RotateCw />
          Reintentar
        </Button>
      }
      className="rounded-lg border border-dashed p-10"
    />
  )
}
