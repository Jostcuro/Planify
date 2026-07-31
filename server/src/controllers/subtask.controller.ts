import type { Request, Response } from 'express'

import { asyncHandler } from '@/middlewares/asyncHandler.js'
import * as subtaskService from '@/services/subtask.service.js'
import type { CreateSubtaskInput } from '@/types/subtask.schema.js'

export const createSubtask = asyncHandler(async (req: Request, res: Response) => {
  const subtask = await subtaskService.createSubtask(
    req.userId!,
    req.params.taskId!,
    req.body as CreateSubtaskInput,
  )

  res.status(201).json({ success: true, data: subtask })
})

export const toggleSubtask = asyncHandler(async (req: Request, res: Response) => {
  const subtask = await subtaskService.toggleSubtask(req.userId!, req.params.subtaskId!)

  res.json({ success: true, data: subtask })
})

export const deleteSubtask = asyncHandler(async (req: Request, res: Response) => {
  const result = await subtaskService.deleteSubtask(req.userId!, req.params.subtaskId!)

  res.json({ success: true, data: result })
})
