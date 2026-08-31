import { apiClient } from '@/api/ApiClient'
import type { GenerateConfigRequest, GenerateConfigResponse } from '@/types/AI.types'

export class AiService {
    static async generateConfig(request: GenerateConfigRequest): Promise<GenerateConfigResponse> {
        return apiClient.post<GenerateConfigResponse>('ai/generate-config', request)
    }
}