import { RefreshTokenRepository } from '../repositories/refresh-token.repository.ts'
import { PasswordResetRepository } from '../repositories/password-reset.repository.ts'

export class CleanupService {

    static async run(): Promise<void> {

        console.log('Running cleanup...')

        const deletedRefreshTokens = await RefreshTokenRepository.cleanup()

        const deletedResetTokens = await PasswordResetRepository.cleanup()

        console.log(`Deleted ${deletedRefreshTokens} expired refresh tokens`)

        console.log(`Deleted ${deletedResetTokens} password reset tokens`)

        console.log('Cleanup completed')
    }
}