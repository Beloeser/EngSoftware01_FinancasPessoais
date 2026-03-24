import { Router } from 'express'
import { userController } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()
router.get('/profile', authMiddleware, userController.getProfile)

export default router
