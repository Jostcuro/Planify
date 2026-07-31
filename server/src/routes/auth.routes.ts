import { Router } from 'express'

import { injectUser } from '@/middlewares/auth.js'

const router = Router()

router.get('/auth/me', injectUser, (req, res) => {
  res.json({ success: true, data: { userId: req.userId } })
})

export default router
