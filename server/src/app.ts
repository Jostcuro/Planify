import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import { env } from '@/config/env.js'
import { errorHandler, notFound } from '@/middlewares/errorHandler.js'
import authRoutes from '@/routes/auth.routes.js'
import categoryRoutes from '@/routes/category.routes.js'
import metricsRoutes from '@/routes/metrics.routes.js'
import subtaskRoutes from '@/routes/subtask.routes.js'
import taskRoutes from '@/routes/task.routes.js'

const DEFAULT_CLIENT_URL = 'http://localhost:5173'

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

const clerkCspDirectives = {
  'script-src': ["'self'", 'https://*.clerk.accounts.dev', 'https://*.protect.clerk.com'],
  'connect-src': ["'self'", 'https://*.clerk.accounts.dev', 'https://*.protect.clerk.com', 'wss://*.clerk.accounts.dev'],
  'img-src': ["'self'", 'data:', 'https://img.clerk.com'],
  'worker-src': ["'self'", 'blob:'],
  'frame-src': ["'self'", 'https://challenges.cloudflare.com', 'https://*.protect.clerk.com'],
}

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  app.use(
    helmet({
      contentSecurityPolicy:
        env.NODE_ENV === 'production' ? { directives: clerkCspDirectives } : false,
    }),
  )

  if (env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  app.use(
    cors({
      origin: env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use('/api', apiLimiter, clerkMiddleware())

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      data: { status: 'ok', uptime: process.uptime() },
    })
  })

  app.use('/api', authRoutes)
  app.use('/api/categories', categoryRoutes)
  app.use('/api/tasks', taskRoutes)
  app.use('/api/tasks/:taskId/subtasks', subtaskRoutes)
  app.use('/api/metrics', metricsRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
