import { describe, expect, it } from 'vitest'

import { api } from '@/services/api'

describe('api client', () => {
  it('usa una baseURL que incluye el prefijo /api del backend', () => {
    expect(api.defaults.baseURL).toBeTruthy()
    expect(api.defaults.baseURL?.startsWith('http')).toBe(true)
    expect(api.defaults.baseURL?.endsWith('/api')).toBe(true)
  })
})
