import crypto from 'crypto'
import { UserRepository } from '../repositories/user.repository.ts'
import { PasswordResetRepository } from '../repositories/password-reset.repository.ts'
import { hashToken } from '../utils/crypto.ts'
import { EmailService } from '../email/email.service.ts'
import { EmailTemplate } from '../email/email-template.ts'
import { appConfig } from '../config/app.config.ts'

export class PasswordResetService {

    static async generateResetToken(email: string): Promise<void | unknown> {
        const user = await UserRepository.findByEmail(email)

        if (!user) return null

        await PasswordResetRepository.deleteByUserId(user.id)

        const restToken = crypto.randomBytes(32).toString('hex')
        const tokenHash = hashToken(restToken)
        const expiresAt = new Date()

        expiresAt.setMinutes(expiresAt.getMinutes() + 15)

        await PasswordResetRepository.create(user.id, tokenHash, expiresAt.toISOString())

        const resetUrl = `${appConfig.frontendUrl}/reset-password?token=${restToken}`

        await EmailService.send({
            template: EmailTemplate.PASSWORD_RESET,
            to: user.email,
            data: { username: user.username, resetUrl }
        })
    }
}