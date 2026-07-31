import { Router } from 'express'

import { getMetrics } from '@/controllers/metrics.controller.js'
import { injectUser, requireAuth } from '@/middlewares/auth.js'

const router = Router()

router.use(requireAuth, injectUser)

router.get('/', getMetrics)

export default router
