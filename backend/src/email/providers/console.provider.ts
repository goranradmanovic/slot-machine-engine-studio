import type { EmailProvider } from "../email-provider.ts"
import type { SendEmailOptions } from "../email-template.ts"

export class ConsoleProvider implements EmailProvider {

    async send(options: SendEmailOptions): Promise<void> {
        console.log('')

        console.log('========== EMAIL ==========')

        console.log(`To: ${options.to}`)

        console.log(`Subject: ${options.subject}`)

        console.log('')

        console.log(options.html)

        console.log('===========================')

        console.log('')
    }
}