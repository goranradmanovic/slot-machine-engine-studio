import { apiClient } from "@/api/ApiClient"
import type { ConfigFolderDto } from "@/dto/config/ConfigFolderDto"


export class ConfigService {

    // Create new user config folder
    static async createConfigFolder(dto: ConfigFolderDto): Promise<void> {
        const response = await apiClient.post<void>('configs/folder', dto)
        return response
    }
}