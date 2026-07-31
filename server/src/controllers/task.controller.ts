import type { Request, Response } from 'express'

import { asyncHandler } from '@/middlewares/asyncHandler.js'
import * as taskService from '@/services/task.service.js'
import type { CreateTaskInput, TaskFilters, UpdateTaskInput } from '@/types/task.schema.js'

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const filters = res.locals.query as TaskFilters
  const tasks = await taskService.getTasks(req.userId!, filters)

  res.json({ success: true, data: tasks })
})

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getTaskById(req.userId!, req.params.id!)

  res.json({ success: true, data: task })
})

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.userId!, req.body as CreateTaskInput)

  res.status(201).json({ success: true, data: task })
})

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.updateTask(req.userId!, req.params.id!, req.body as UpdateTaskInput)

  res.json({ success: true, data: task })
})

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const result = await taskService.deleteTask(req.userId!, req.params.id!)

  res.json({ success: true, data: result })
})
