import type { Request, Response } from 'express'

import { asyncHandler } from '@/middlewares/asyncHandler.js'
import { calculateMetrics } from '@/services/metrics.service.js'

export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await calculateMetrics(req.userId!)

  res.json({ success: true, data: metrics })
})
