import { Router } from 'express'
import { UserController } from '../controllers/user.controller.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { authorize } from '../../../middlewares/authorize.middleware.ts'
import { Permission } from '../../../enums/permission.enum.ts'
import { asyncHandler } from '../../../utils/async-handler.ts'

const router = Router()

// GET /api/users/permissions -> ["game.read","game.write","config.read","config.write","asset.read","asset.write"]
router.get('/permissions', authenticate, asyncHandler(UserController.getAvailablePermissions))

// GET /api/users/5/permissions -> ["game.read","game.write","config.read"]
router.get('/:id/permissions', authenticate, authorize(Permission.USER_READ), asyncHandler(UserController.getPermissions))

// PUT /api/users/5/permissions -> { "permissions": ["game.read","game.write","config.read","config.write","asset.read"] }
router.put('/:id/permissions', authenticate, authorize(Permission.USER_WRITE), asyncHandler(UserController.updatePermissions))

router.put('/:id/user', authenticate, authorize(Permission.USER_WRITE), asyncHandler(UserController.updateUserFullName))

export default router