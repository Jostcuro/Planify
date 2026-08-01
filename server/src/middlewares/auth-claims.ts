export interface ClerkUserProfile {
  id: string
  email: string
  name: string
}

const FALLBACK_EMAIL_DOMAIN = '@clerk.local'

export function mapClaimsToUser(
  userId: string,
  claims: Record<string, unknown> = {},
): ClerkUserProfile {
  const email =
    typeof claims.email === 'string' && claims.email.length > 0
      ? claims.email
      : `${userId}${FALLBACK_EMAIL_DOMAIN}`

  const firstName = typeof claims.firstName === 'string' ? claims.firstName : ''
  const lastName = typeof claims.lastName === 'string' ? claims.lastName : ''

  const name = [firstName, lastName].filter(Boolean).join(' ') || email

  return { id: userId, email, name }
}
