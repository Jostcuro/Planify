import { clerkMiddleware } from '@clerk/express'
import cors from 'cors'
import express, { type Express } from 'express'
import morgan from 'morgan'

import { errorHandler, notFound } from '@/middlewares/errorHandler.js'
import authRoutes from '@/routes/auth.routes.js'
import categoryRoutes from '@/routes/category.routes.js'
import metricsRoutes from '@/routes/metrics.routes.js'
import subtaskRoutes from '@/routes/subtask.routes.js'
import taskRoutes from '@/routes/task.routes.js'

const DEFAULT_CLIENT_URL = 'http://localhost:5173'

export function createApp(): Express {
  const app = express()

  app.disable('x-powered-by')

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? DEFAULT_CLIENT_URL,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use('/api', clerkMiddleware())

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
