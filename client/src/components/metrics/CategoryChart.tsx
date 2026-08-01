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

import { getCategoryStyle } from '@/lib/format'
import type { CategoryCount } from '@/types'

interface CategoryChartProps {
  data: CategoryCount[]
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({ ...item, name: item.name || 'Sin categoría' }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          width={100}
        />
        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
        <Bar dataKey="count" name="Tareas" radius={[0, 4, 4, 0]} barSize={16}>
          {chartData.map((entry) => (
            <Cell key={entry.categoryId ?? 'none'} fill={getCategoryStyle(entry.color)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
