import type { CookieOptions } from "express"

export function getRefreshCookieOptions(rememberMe: boolean = false): CookieOptions {

    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        path: '/'
    }
}