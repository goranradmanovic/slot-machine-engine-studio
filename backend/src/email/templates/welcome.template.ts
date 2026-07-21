import { emailLayout } from './layout.template.ts'
import type { RenderedEmail } from '../template-renderer.ts'

export function welcomeTemplate(data: Record<string, unknown>): RenderedEmail {

    const username = data.username as string

    return {
        subject: 'Welcome',
        html: emailLayout('Welcome',
            `
                <h2>Hello ${username}</h2>
                <p>You have succeffuly register.</p>
            `
        )
    }
}