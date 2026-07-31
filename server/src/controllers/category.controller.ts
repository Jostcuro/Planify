import type { NextFunction, Request, Response } from 'express'

import { asyncHandler } from '@/middlewares/asyncHandler.js'
import * as categoryService from '@/services/category.service.js'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types/category.schema.js'

export const listCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getUserCategories(req.userId!)

  res.json({ success: true, data: categories })
})

export const createCategory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const category = await categoryService.createCategory(req.userId!, req.body as CreateCategoryInput)

    res.status(201).json({ success: true, data: category })
  },
)

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const category = await categoryService.updateCategory(
      req.userId!,
      req.params.id!,
      req.body as UpdateCategoryInput,
    )

    res.json({ success: true, data: category })
  },
)

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await categoryService.deleteCategory(req.userId!, req.params.id!)

    res.json({ success: true, data: result })
  },
)
