import { cn } from '@/lib/utils'

interface GridBackgroundProps {
  className?: string
}

export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'bg-grid-white pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]',
        className,
      )}
      aria-hidden="true"
    />
  )
}
