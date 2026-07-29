import type { UpdateFullNameDto } from '@/dto/users/UpdateFullNameDto'
import { apiClient } from '@/api/ApiClient'

export class UserService {

    static async updateFirstLastName(dto: UpdateFullNameDto): Promise<void> {
        const response = await apiClient.put(`users/${dto.id}/user`, dto)
        return response
    }
}