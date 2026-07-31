import type { MetricsResponse } from '@/types'
import { api } from '@/services/api'

export async function fetchMetrics(): Promise<MetricsResponse> {
  const { data } = await api.get<{ success: boolean; data: MetricsResponse }>('/metrics')
  return data.data
}
