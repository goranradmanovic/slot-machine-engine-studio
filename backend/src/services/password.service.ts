import { ApiError } from "../utils/api-error.ts"
import { hashPassword, verifyPassword } from "../utils/password.ts"
import { hashToken } from "../utils/crypto.ts"
import { UserRepository } from "../repositories/user.repository.ts"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.ts"
import { PasswordResetRepository } from "../repositories/password-reset.repository.ts"

export class PasswordService {

    static async resetPassword(token: string, password: string): Promise<void> {
        const tokenHash = hashToken(token)

        const reset = await PasswordResetRepository.findByHash(tokenHash)

        if (!reset) throw new ApiError(400, 'Invalid reset token')

        if (reset.usedAt) throw new ApiError(400, 'Reset token already used.')

        if (new Date(reset.expiresAt) < new Date()) throw new ApiError(400, 'Reset token expired.')

        const passwordHash = await hashPassword(password)

        await UserRepository.updatePassword(reset.id, passwordHash)

        await RefreshTokenRepository.deleteAllForUser(reset.userId)

        await PasswordResetRepository.markAsUsed(reset.id)
    }

    static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {

        const user = await UserRepository.findById(userId)

        if (!user) throw new ApiError(404, 'User not found.')

        const validPassword = await verifyPassword(currentPassword, user.password)

        if (!validPassword) throw new ApiError(401, 'Current password is incorect')

        const isSamePassword = await verifyPassword(newPassword, user.password)
        
        if (isSamePassword) throw new ApiError(400, 'New password must be different from current password.')

        const passwordHash = await hashPassword(newPassword)

        await UserRepository.updatePassword(user.id, passwordHash)

        await RefreshTokenRepository.deleteAllForUser(user.id) // Delete all session
    }
}