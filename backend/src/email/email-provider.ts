export interface ProviderEmail {
    to: string;
    subject: string;
    html: string;
}

export interface EmailProvider {
    send(options: ProviderEmail): Promise<void>
}