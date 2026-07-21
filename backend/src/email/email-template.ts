export enum EmailTemplate {
    PASSWORD_RESET = 'password-reset',
    WELCOME = 'welcome',
    VERIFY_EMAIL = 'verify-email',
}

export interface SendEmailOptions {
    template: EmailTemplate;
    to: string;
    subject?: string;
    html?: string;
    data: Record<string, unknown>;
}