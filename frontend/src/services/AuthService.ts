import { apiClient } from '@/api/ApiClient.ts'
import { Auth } from "@/utils/auth"
import type { LoginDto } from "@/dto/auth/LoginDto"
import type { LoginResponseDto } from "@/dto/auth/LoginResponseDto"
import type { RegisterDto } from "@/dto/auth/RegisterDto"
import type { ForgotPasswordDto } from '@/dto/auth/ForgotPasswordDto'
import type { ResetPasswordDto } from '@/dto/auth/ResetPasswordDto'

export class AuthService {

    // Login
    static async login(dto: LoginDto): Promise<LoginResponseDto> {
        const response = await apiClient.post<LoginResponseDto>('auth/login', dto)
        
        Auth.setTokens(response?.data?.accessToken, response?.data?.refreshToken)

        return response
    }

    // Register
    static async register(dto: RegisterDto): Promise<void> {
        const response = await apiClient.post<void>('auth/register', dto)
        return response
    }

    // Logout
    static async logout(): Promise<void> {
        try {
            await apiClient.post('auth/logout', { refreshToken: Auth.getRefreshToken() })
        }
        finally {
            Auth.clear()
        }
    }

    // Forgot password
    static async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
        const response = await apiClient.post('auth/forgot-password', dto)
        return response
    }

    // Reset password
    static async resetPassword(dto: ResetPasswordDto): Promise<void> {
        const response = await apiClient.post('auth/reset-password', dto)
        return response
    }

    // Refresh Access Token
    static async refresh(): Promise<void> {
        const refreshToken = Auth.getRefreshToken()

        if (!refreshToken) throw new Error('Missing refresh token.')

        const response = await apiClient.post<{ accessToken: string}>('auth/refresh', { refreshToken })

        console.log('REFRESH ACCESS TOKEN REPONSE - ', response)
        Auth.setAccessToken(response?.data?.accessToken)
    }

    // Local authenticate check
    static isAuthenticated(): boolean {
        return !!Auth.getAccessToken()
    }
}