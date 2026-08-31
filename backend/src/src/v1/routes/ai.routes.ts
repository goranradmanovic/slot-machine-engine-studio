import { Router } from 'express'
import { AiController } from '../controllers/ai.controller.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { authorize } from '../../../middlewares/authorize.middleware.ts'
import { Permission } from '../../../enums/permission.enum.ts'
import { asyncHandler } from '../../../utils/async-handler.ts'

const router = Router()

// Test AI connection
router.get('/test', authenticate, asyncHandler(AiController.test))

// Generate Slot Config
router.post('/generate-config', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), asyncHandler(AiController.generateConfig))

export default router