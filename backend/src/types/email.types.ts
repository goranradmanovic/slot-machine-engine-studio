export interface PasswordResetTemplateData {
    username: string
    resetUrl: string
}

export interface WelcomeTemplateData {
    username: string
}

export interface VerifyEmailTemplateData {
    username: string
    verificationUrl: string
}