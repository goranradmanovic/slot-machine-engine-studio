import { ApiError } from "../utils/api-error.ts"
import { hashPassword, comparePassword } from "../utils/password.ts"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.ts"
import { UserRepository } from "../repositories/user.repository.ts"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.ts"
import type { RegisterDto, LoginDto, LoginResponseDto, RefreshResponseDto } from "../types/auth.types.ts"
import { generateSessionId, hashToken } from "../utils/crypto.ts"
import { EmailService } from "../email/email.service.ts"
import { EmailTemplate } from "../email/email-template.ts"
import { PermissionService } from "../services/permission.service.ts"
import { stringifyPermissions } from "../utils/permission.ts"

export class AuthService {

    // Create new user in DB
    static async register(data: RegisterDto) {
        const { username, email, password } = data

        const existingEmail = await UserRepository.findByEmail(email)

        if (existingEmail) throw new ApiError(409, 'Email alrady exists.')

        const existingUsername = await UserRepository.findByUsername(username)

        if (existingUsername) throw new ApiError(409, 'Username alrady exists.')

        const hashedPassword = await hashPassword(password)
        
        const permissions = PermissionService.getDefaultPermissions()

        const user = await UserRepository.create({ username, email, password: hashedPassword, permissions: stringifyPermissions(permissions) })

        await EmailService.send({
            template: EmailTemplate.WELCOME,
            to: user.email,
            data: { username: user.username }
        })

        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            permissions: user.permissions,
            createdAt: user.createdAt
        }
    }

    // Login user
    static async login(data: LoginDto): Promise<LoginResponseDto> {
        
        const { email, password, rememberMe } = data // Get user input data

        const user = await UserRepository.findByEmail(email)

        if (!user) throw new ApiError(401, 'Invalid email or password.')

        const passwordMatches = await comparePassword(password, user.password)

        if (!passwordMatches) throw new ApiError(401, 'Invalid email or password.')
        
        const sessionId = generateSessionId()

        const payload = {
            sub: user.id,
            sid: sessionId,
            username: user.username,
            email: user.email,
            permissions: user.permissions
        }

        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        const tokenHash = hashToken(refreshToken)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1))

        await RefreshTokenRepository.create(sessionId, user.id, tokenHash, expiresAt.toISOString())

        return { 
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                permissions: user.permissions
            }
        }
    }

    static async refresh(refreshToken: string): Promise<RefreshResponseDto> {
        const payload = verifyRefreshToken(refreshToken)
        const oldHash = hashToken(refreshToken)
        const session = await RefreshTokenRepository.findSession(oldHash)

        if (!session) throw new ApiError(401, 'Invalid refresh token.')

        const sessionId = generateSessionId()

        const newPayload = {
            sub: session.userId,
            sid: sessionId,
            username: session.username,
            email: session.email,
            permissions: session.permissions
        }

        const accessToken = generateAccessToken(newPayload)
        const newRefreshToken = generateRefreshToken(newPayload)
        const newHash = hashToken(newRefreshToken)

        await RefreshTokenRepository.deleteBySessionId(session.sessionId)

        await RefreshTokenRepository.create(sessionId, session.userId, newHash, session.expiresAt)

        return {
            accessToken,
            refreshToken: newRefreshToken,
        }
    }
}