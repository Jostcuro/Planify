import { Router } from 'express'

import { ensureUser, injectUser, requireAuth } from '@/middlewares/auth.js'
import { validateBody, validateQuery } from '@/middlewares/validate.js'
import {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} from '@/controllers/task.controller.js'
import { createTaskSchema, taskFiltersSchema, updateTaskSchema } from '@/types/task.schema.js'

const router = Router()

router.use(requireAuth, injectUser, ensureUser)

router.get('/', validateQuery(taskFiltersSchema), listTasks)
router.get('/:id', getTaskById)
router.post('/', validateBody(createTaskSchema), createTask)
router.patch('/:id', validateBody(updateTaskSchema), updateTask)
router.delete('/:id', deleteTask)

export default router
