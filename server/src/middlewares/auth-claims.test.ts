import { describe, expect, it } from 'vitest'

import { mapClaimsToUser } from '@/middlewares/auth-claims.js'

describe('mapClaimsToUser', () => {
  it('usa email y nombre completos de los claims', () => {
    expect(
      mapClaimsToUser('user_123', {
        email: 'juan@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
      }),
    ).toEqual({ id: 'user_123', email: 'juan@example.com', name: 'Juan Pérez' })
  })

  it('genera email fallback cuando falta en los claims', () => {
    expect(mapClaimsToUser('user_123', {})).toEqual({
      id: 'user_123',
      email: 'user_123@clerk.local',
      name: 'user_123@clerk.local',
    })
  })

  it('usa el email como nombre cuando faltan firstName y lastName', () => {
    expect(mapClaimsToUser('user_123', { email: 'ana@example.com' })).toEqual({
      id: 'user_123',
      email: 'ana@example.com',
      name: 'ana@example.com',
    })
  })

  it('solo usa firstName cuando lastName falta', () => {
    expect(
      mapClaimsToUser('user_123', { email: 'a@example.com', firstName: 'Ana' }),
    ).toEqual({ id: 'user_123', email: 'a@example.com', name: 'Ana' })
  })
})
