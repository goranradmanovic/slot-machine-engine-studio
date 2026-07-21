import { ApiError } from "../utils/api-error.ts"
import { UserRepository } from "../repositories/user.repository.ts"
import type { UserResponseDto } from '../types/user.types.ts'
import { Permission } from "../enums/permission.enum.ts"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.ts"

export class UserService {

    static async me(id: number): Promise<UserResponseDto> {
        const user = await UserRepository.findById(id)

        if (!user) throw new ApiError(404, 'User not found.')

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            permissions: user.permissions,
            createdAt: user.createdAt
        }
    }

    static async getPermissions(userId: number): Promise<Permission[]> {
        return UserRepository.getPermissions(userId)
    }

    static async updatePermissions(userId: number, permissions: Permission[]): Promise<void> {
        await UserRepository.updatePermissions(userId, permissions)
        // Delete all user tokens to logout it, so updated permissions get applied
        await RefreshTokenRepository.deleteByUserId(userId)
    }

    static async updateUserFullName(userId: number, firstName: string, lastName: string) {
        await UserRepository.updateUserFullName(userId, firstName, lastName)
    }
}