import type { Request, Response } from 'express'
import { AiService } from '../../../services/ai.service.ts'
import { ApiResponse } from '../../../utils/api-response.ts'
import type { GenerateConfigDto } from '../../../dto/ai/GenerateConfigDto.ts'

export class AiController {
    // Test to check AI response
    static async test(req: Request, res: Response): Promise<void> {
        const message = await AiService.test()

        res.json(new ApiResponse(true, message))
    }

    // Generate Config
    static async generateConfig(req: Request, res: Response): Promise<void> {
        const { prompt, config } = req.body as GenerateConfigDto

        const result = await AiService.generateConfig(config, prompt)

        res.json({ success: true, data: result })
    }
}