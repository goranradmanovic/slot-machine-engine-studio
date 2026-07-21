import { emailLayout } from './layout.template.ts'
import type { RenderedEmail } from '../template-renderer.ts'

export function verifyEmailTemplate(data: Record<string, unknown>): RenderedEmail {

    const username = data.username as string

    return {
        subject: 'Verify Email',
        html: emailLayout('Verify Email',
            `
                <h2>Hello ${username}</h2>
                <p>Please verify your email address.</p>
            `
        )
    }
}