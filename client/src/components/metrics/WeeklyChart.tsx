import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DayCompletion } from '@/types'

interface WeeklyChartProps {
  data: DayCompletion[]
}

function weekdayLabel(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { weekday: 'short' })
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={weekdayLabel}
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={30} />
        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
        <Bar dataKey="count" name="Completadas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
