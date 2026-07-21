import { EmailTemplate } from './email-template.ts'
import { passwordResetTemplate } from './templates/password-reset.template.ts'
import { welcomeTemplate } from './templates/welcome.template.ts'
import { verifyEmailTemplate } from './templates/verify-email.template.ts'

export interface RenderedEmail {
    subject: string;
    html: string;
}

export class TemplateRenderer {

    static render(template: EmailTemplate, data: Record<string, unknown>): RenderedEmail {

        switch (template) {

            case EmailTemplate.PASSWORD_RESET:
                return passwordResetTemplate(data)

            case EmailTemplate.WELCOME:
                return welcomeTemplate(data)

            case EmailTemplate.VERIFY_EMAIL:
                return verifyEmailTemplate(data)

            default:
                throw new Error(`Unknown email template: ${template}`)
        }
    }
}