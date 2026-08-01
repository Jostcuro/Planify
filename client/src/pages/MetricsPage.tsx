import MetricsView from '@/components/metrics/MetricsView'
import { useMetrics } from '@/hooks/useMetrics'

export default function MetricsPage() {
  const { data: metrics, isLoading, isError, refetch } = useMetrics()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumen del rendimiento de tus tareas.</p>
      </div>

      <MetricsView
        metrics={metrics}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </div>
  )
}
