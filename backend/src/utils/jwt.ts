import jwt, { type JwtPayload } from 'jsonwebtoken'
import { appConfig } from '../config/app.config.ts'
import type { JWTPayload } from '../types/jwt.types.ts'

export function signToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    return jwt.sign(payload, secret, { expiresIn })
}

export function generateAccessToken(payload: JWTPayload): string {
    return signToken(payload, appConfig.accessSecret, appConfig.accessExpires)
}

export function generateRefreshToken(payload: JWTPayload): string {
    return signToken(payload, appConfig.refreshSecret, appConfig.refreshExpires)
}

export function verifyToken<T>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T
}

export function verifyAccessToken(token: string): JWTPayload {
    return verifyToken(token, appConfig.accessSecret) as JWTPayload
}

export function verifyRefreshToken(token: string): JWTPayload {
    return verifyToken(token, appConfig.refreshSecret) as JWTPayload
}
