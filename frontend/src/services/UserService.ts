import type { UserDto } from '@/dto/users/UserDto'
import { apiClient } from '@/api/ApiClient'

export class UserService {
    static async updateUser(dto: UserDto): Promise<void> {
        const response = await apiClient.patch(`users/${dto.id}`, dto)
        return response
    }
}