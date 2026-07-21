import { Resend } from 'resend'
import type { EmailProvider } from '../email-provider.ts'
import { appConfig } from '../../config/app.config.ts'
import type { SendEmailOptions } from '../email-template.ts'

const resend = new Resend(appConfig.resendApiKey)

export class ResendProvider implements EmailProvider {

    async send(options: SendEmailOptions): Promise<void> {
        await resend.emails.send({
            from: appConfig.emailFrom,
            to: options.to,
            subject: options.subject,
            html: options.html
        })
    }
}