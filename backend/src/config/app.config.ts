import dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
    // Auth
    accessSecret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpires: process.env.ACCESS_TOKEN_EXPIRES || '15m',
    refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || '30d',
    cookieName: process.env.COOKIE_NAME || 'refreshToken',

    // App
    cleanupIntervalMinutes: Number(process.env.CLEANUP_INTERVAL_MINUTES ?? 60) as number,
    appUrl: process.env.APP_URL as string,
    port: Number(process.env.PORT ?? 3000) as number,
    databasePath: process.env.DATABASE_PATH as string,
    enviroment: process.env.NODE_ENV as string,
    frontendUrl: process.env.FRONTEND_URL as string,

    // Email
    emailProvider: process.env.EMAIL_PROVIDER as string,
    resendApiKey: process.env.RESEND_API_KEY as string,
    emailFrom: process.env.EMAIL_FROM as string
}