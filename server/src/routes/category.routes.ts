import { Router } from 'express'

import { ensureUser, injectUser, requireAuth } from '@/middlewares/auth.js'
import { validateBody } from '@/middlewares/validate.js'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@/controllers/category.controller.js'
import { createCategorySchema, updateCategorySchema } from '@/types/category.schema.js'

const router = Router()

router.use(requireAuth, injectUser, ensureUser)

router.get('/', listCategories)
router.post('/', validateBody(createCategorySchema), createCategory)
router.patch('/:id', validateBody(updateCategorySchema), updateCategory)
router.delete('/:id', deleteCategory)

export default router
