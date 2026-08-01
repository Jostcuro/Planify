import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { STATUS_BAR_COLORS, STATUS_LABELS } from '@/lib/format'
import type { StatusCount } from '@/types'

interface StatusChartProps {
  data: StatusCount[]
}

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((item) => ({ ...item, label: STATUS_LABELS[item.status] }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={80}
        />
        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
        <Bar dataKey="count" name="Tareas" radius={[0, 4, 4, 0]} barSize={16}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={STATUS_BAR_COLORS[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
