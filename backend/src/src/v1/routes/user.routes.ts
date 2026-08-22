import { Router } from 'express'
import { UserController } from '../controllers/user.controller.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { authorize } from '../../../middlewares/authorize.middleware.ts'
import { Permission } from '../../../enums/permission.enum.ts'
import { asyncHandler } from '../../../utils/async-handler.ts'

const router = Router()

// GET /api/users/permissions
router.get('/permissions', authenticate, authorize(Permission.ADMIN), asyncHandler(UserController.getAvailablePermissions))

// GET /api/users/5/permissions
router.get('/:id/permissions', authenticate, authorize(Permission.ADMIN), asyncHandler(UserController.getPermissions))

// PUT /api/users/5/permissions
router.put('/:id/permissions', authenticate, authorize(Permission.ADMIN), asyncHandler(UserController.updatePermissions))

// GET /api/users/all
router.get('/all', authenticate, authorize(Permission.ADMIN), asyncHandler(UserController.getUsers))

// PATCH /api/users/1
router.patch('/:id', authenticate, authorize(Permission.ADMIN), asyncHandler(UserController.updateUser))

// DELETE /api/users/5
router.delete('/:id', authenticate,  authorize(Permission.ADMIN), asyncHandler(UserController.deleteUserById))

export default router