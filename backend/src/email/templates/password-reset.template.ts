import { emailLayout } from './layout.template.ts'
import type { RenderedEmail } from '../template-renderer.ts'

export function passwordResetTemplate(data: Record<string, unknown>): RenderedEmail {

    const username = data.username as string
    const resetUrl = data.resetUrl as string

    return {
        subject: 'Reset your password',
        html: emailLayout('Reset Password',
            `
                <h2>Hello ${username}</h2>
                <p>We received a request to reset your password.</p>
                <p>
                    <a href="${resetUrl}">Reset Password</a>
                </p>
                <p>This link expires in 15 minutes.</p>
            `
        )
    }
}