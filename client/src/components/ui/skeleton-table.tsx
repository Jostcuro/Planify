import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonTableProps {
  rows?: number
}

export default function SkeletonTable({ rows = 4 }: SkeletonTableProps) {
  return (
    <div className="grid gap-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <Card key={index} data-testid="skeleton-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
              </div>
            </div>
            <Skeleton className="mt-3 h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-full" />
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
