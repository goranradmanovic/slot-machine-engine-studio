import { ConsoleProvider } from "./providers/console.provider.ts"
import { ResendProvider } from "./providers/resend.provider.ts"
import type { EmailProvider } from "./email-provider.ts"
import type { SendEmailOptions } from "./email-template.ts"
import { TemplateRenderer } from './template-renderer.ts'
import { appConfig } from "../config/app.config.ts"

export class EmailService {

    private static provider(): EmailProvider {

        switch(appConfig.emailProvider) {
            case 'resend':
                return new ResendProvider()

            default:
                return new ConsoleProvider
        }
    }

    static async send( options: SendEmailOptions): Promise<void> {

        const email = TemplateRenderer.render(options.template, options.data)

        await this.provider().send({
            to: options.to,
            subject: email.subject,
            html: email.html,
        })
    }
}