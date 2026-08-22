import { Router } from 'express'
import { ConfigController } from '../controllers/configs.controller.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { authorize } from '../../../middlewares/authorize.middleware.ts'
import { Permission } from '../../../enums/permission.enum.ts'

const router = Router()

router.get('/files', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.listFiles) // GET /api/v1/configs/files -> authorize(Permission.ADMIN, Permission.MANAGER)
router.post('/files', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.createFile); // POST /api/v1/configs/files -> authenticate, authorize(Permission.CONFIG_WRITE, Permission.CONFIG_READ),

router.get('/files/:filename', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.getFile) // GET /api/v1/configs/files/:filename
router.patch('/files/:filename', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.updateFile) // PATCH /api/v1/configs/files/:filename
router.delete('/files/:filename', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.deleteFile) // DELETE /api/v1/configs/files/:filename

router.get('/files/download/:filename', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.downloadFile) // GET /api/v1/configs/files/download/:filename

router.post('/folder', authenticate, authorize(Permission.ADMIN, Permission.MANAGER), ConfigController.createFolder) // POST /api/v1/configs/folder

export default router