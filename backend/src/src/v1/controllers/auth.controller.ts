import type { Request, Response } from 'express'
import { ApiResponse } from '../../../utils/api-response.ts'
import { AuthService } from '../../../services/auth.service.ts'
import type { RegisterDto, LoginDto, ResetPasswordDto, ChangePasswordDto } from '../../../types/auth.types.ts'
import type { ForgotPasswordDto } from '../../../types/auth.types.ts'
import { getRefreshCookieOptions } from '../../../utils/cookies.ts'
import { appConfig } from '../../../config/app.config.ts'
import { ApiError } from '../../../utils/api-error.ts'
import { SessionService } from '../../../services/session.service.ts'
import { UserService } from '../../../services/user.service.ts'
import { PasswordResetService } from '../../../services/password-reset.service.ts'
import { PasswordService } from '../../../services/password.service.ts'

export class AuthController {

    static async register(req: Request, res: Response): Promise<void> {
        const user = await AuthService.register(req.body as RegisterDto)

        res.status(201).json(
            new ApiResponse(true, 'User register successfully', user)
        )
    }

    static async login(req: Request, res: Response): Promise<void> {
        const loginResults = await AuthService.login(req.body as LoginDto)

        res.cookie(appConfig.cookieName, loginResults.refreshToken, getRefreshCookieOptions(req.body.rememberMe))

        res.status(200).json(
            new ApiResponse(true, 'Login successful', { accessToken: loginResults.accessToken, refreshToken: loginResults.refreshToken, user: loginResults.user })
        )
    }

    static async refresh(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies[appConfig.cookieName]

        if (!refreshToken) throw new ApiError(401, 'Refresh token missing.')

        const tokens = await AuthService.refresh(refreshToken)

        res.cookie(appConfig.cookieName, tokens.refreshToken, getRefreshCookieOptions())

        res.json(
            new ApiResponse(true, 'Token refreshed', { accessToken: tokens.accessToken })
        )
    }

    static async me(req: Request, res: Response): Promise<void> {
        const user = await UserService.me(req.user!.sub)

        res.json(
            new ApiResponse(true, 'Current user.', user)
        )
    }

    static async logout(req: Request, res: Response): Promise<void> {
        const refreshToken = req.cookies[appConfig.cookieName]

        if (refreshToken) {
            await SessionService.logout(refreshToken)
        }

        res.clearCookie(appConfig.cookieName)

        res.json(
            new ApiResponse(true, 'Logged out.')
        )
    }

    static async logoutAll(req: Request, res: Response): Promise<void> {
        await SessionService.logoutAll(req.user!.sub)

        res.clearCookie(appConfig.cookieName)

        res.json(
            new ApiResponse(true, 'Logged out from all devices')
        )
    }

    static async forgotPassword(req: Request, res: Response): Promise<void> {
        const dto = req.body as ForgotPasswordDto

        const resetToken = await PasswordResetService.generateResetToken(dto.email)

        res.json(
            new ApiResponse(
                true,
                'If the account exists, a password reset email will be sent',
                //appConfig.enviroment === 'development' ? { resetToken } : null
            )
        )
    }

    static async resetPassword(req: Request, res: Response): Promise<void> {
        const dto = req.body as ResetPasswordDto

        if (dto.password !== dto.confirmPassword) throw new ApiError(400, 'Password do not match')

        await PasswordService.resetPassword(dto.token, dto.password)

        res.json(
            new ApiResponse(true, 'Password created successfuly.')
        )
    }

    static async changePassword(req: Request, res: Response): Promise<void> {
        const dto = req.body as ChangePasswordDto

        if (dto.newPassword !== dto.confirmPassword) throw new ApiError(400, 'Password do not match')
        
        const userId = Number(req.user?.sid)

        await PasswordService.changePassword(userId, dto.currentPassword, dto.newPassword)

        res.json(
            new ApiResponse(true, 'Password changed successfuly.')
        )
    }
}