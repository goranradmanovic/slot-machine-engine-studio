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
router.get('/:id/permissions', authenticate, /*authorize(Permission.USER_READ),*/ asyncHandler(UserController.getPermissions))

// PUT /api/users/5/permissions -> { "permissions": ["game.read","game.write","config.read","config.write","asset.read"] }
router.put('/:id/permissions', authenticate, /*authorize(Permission.USER_WRITE),*/ asyncHandler(UserController.updatePermissions))

// GET /api/users/all
router.get('/all', authenticate, asyncHandler(UserController.getUsers))

// PATCH /api/users/1
router.patch('/:id', authenticate, asyncHandler(UserController.updateUser))

// DELETE /api/users/5
router.delete('/:id', authenticate, asyncHandler(UserController.deleteUserById))

export default router