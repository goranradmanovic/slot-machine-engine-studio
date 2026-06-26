import { Router } from 'express'
import { ConfigController } from '../controllers/configs.controller.ts'

const router = Router()

router.route('/')
    .get(ConfigController.getAllConfigVersions) // GET /api/v1/configs

router.route('/:filename')
    .get(ConfigController.getConfigFile) // GET /api/v1/configs/:filename
    .patch(ConfigController.updateConfigFile) // PATCH /api/v1/configs/:filename

export default router