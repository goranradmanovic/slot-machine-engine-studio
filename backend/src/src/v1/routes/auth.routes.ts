import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.ts'
import { asyncHandler } from '../../../utils/async-handler.ts'
import { validate } from '../../../middlewares/validation.middleware.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { registerSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../../../validations/auth.validation.ts'

const router = Router()

router.get('/me', authenticate, asyncHandler(AuthController.me))

router.post('/register', validate(registerSchema), asyncHandler(AuthController.register))

router.post('/login', validate(loginSchema), asyncHandler(AuthController.login))
router.post('/logout', authenticate, asyncHandler(AuthController.logout))
router.post('/logout-all', authenticate, asyncHandler(AuthController.logoutAll))

router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(AuthController.forgotPassword))
router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(AuthController.resetPassword))
router.put('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(AuthController.changePassword))

router.post('/refresh', asyncHandler(AuthController.refresh))

export default router