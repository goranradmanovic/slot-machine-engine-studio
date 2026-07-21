import { Router } from 'express'
import { ConfigController } from '../controllers/configs.controller.ts'
import { authenticate } from '../../../middlewares/auth.middleware.ts'
import { authorize } from '../../../middlewares/authorize.middleware.ts'
import { Permission } from '../../../enums/permission.enum.ts'

const router = Router()

router.get('/files', authenticate, ConfigController.listFiles) // GET /api/v1/configs/files
router.post('/files', authenticate, ConfigController.createFile); // POST /api/v1/configs/files -> authenticate, authorize(Permission.CONFIG_WRITE, Permission.CONFIG_READ),

router.get('/files/:filename', authenticate, ConfigController.getFile) // GET /api/v1/configs/files/:filename
router.patch('/files/:filename', authenticate, ConfigController.updateFile) // PATCH /api/v1/configs/files/:filename
router.delete('/files/:filename', authenticate, ConfigController.deleteFile) // DELETE /api/v1/configs/files/:filename

router.get('/files/download/:filename', authenticate, ConfigController.downloadFile) // GET /api/v1/configs/files/download/:filename

router.post('/folder', authenticate, ConfigController.createFolder) // POST /api/v1/configs/folder

export default router