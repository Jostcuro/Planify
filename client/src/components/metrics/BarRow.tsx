interface BarRowProps {
  label: string
  value: number
  max: number
  color?: string
}

export default function BarRow({ label, value, max, color }: BarRowProps) {
  const percentage = max === 0 ? 0 : Math.round((value / max) * 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 truncate text-sm">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-sm font-medium">{value}</span>
    </div>
  )
}
