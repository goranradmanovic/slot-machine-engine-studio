import { Router } from 'express'
import { ConfigController } from '../controllers/configs.controller.ts'

const router = Router()

router.route('/files')
    .get(ConfigController.listFiles) // GET /api/v1/configs/files
    .post(ConfigController.createFile); // POST /api/v1/configs/files

router.route('/files/:filename')
    .get(ConfigController.getFile) // GET /api/v1/configs/files/:filename
    .patch(ConfigController.updateFile) // PATCH /api/v1/configs/files/:filename
    .delete(ConfigController.deleteFile); // DELETE /api/v1/configs/files/:filename

export default router