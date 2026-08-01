import { Skeleton } from '@/components/ui/skeleton'
import { ALL_STATUSES } from '@/lib/format'

export default function SkeletonKanban() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-6" aria-hidden="true">
      {ALL_STATUSES.map((status) => (
        <div
          key={status}
          data-testid="skeleton-column"
          className="h-[calc(100vh-200px)] w-72 shrink-0 rounded-lg border bg-muted/40 p-3 lg:w-auto"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="size-2.5 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-6 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
