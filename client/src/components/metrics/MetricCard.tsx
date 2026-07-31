import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string | number
  accent?: 'default' | 'success' | 'danger'
}

export default function MetricCard({ label, value, accent = 'default' }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={cn(
            'mt-1 text-2xl font-semibold',
            accent === 'success' && 'text-emerald-600',
            accent === 'danger' && 'text-red-600',
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
