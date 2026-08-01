import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY es obligatoria'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.url('CLIENT_URL debe ser una URL válida').optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

function loadEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const problems = result.error.issues.map((issue) => issue.path.join('.') || 'variables')
    console.error(`[env] Configuración de entorno inválida. Revisa: ${problems.join(', ')}`)
    throw new Error('Configuración de entorno inválida. Revisa el archivo .env')
  }

  return result.data
}

export const env = loadEnv()
