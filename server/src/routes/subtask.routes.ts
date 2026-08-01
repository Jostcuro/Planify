import { Router } from 'express'

import { createSubtask, deleteSubtask, toggleSubtask } from '@/controllers/subtask.controller.js'
import { ensureUser, injectUser, requireAuth } from '@/middlewares/auth.js'
import { validateBody } from '@/middlewares/validate.js'
import { createSubtaskSchema } from '@/types/subtask.schema.js'

const router = Router()

router.use(requireAuth, injectUser, ensureUser)

router.post('/', validateBody(createSubtaskSchema), createSubtask)
router.patch('/:subtaskId', toggleSubtask)
router.delete('/:subtaskId', deleteSubtask)

export default router
