import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  accent?: 'default' | 'success' | 'danger'
}

export default function KpiCard({ label, value, icon: Icon, accent = 'default' }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0">
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
        </div>
        {Icon ? (
          <span
            className={cn(
              'rounded-md p-1.5',
              accent === 'success' && 'bg-emerald-50 text-emerald-600',
              accent === 'danger' && 'bg-red-50 text-red-600',
              accent === 'default' && 'bg-muted text-muted-foreground',
            )}
          >
            <Icon className="size-4" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}
