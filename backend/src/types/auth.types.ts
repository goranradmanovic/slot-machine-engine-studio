import type { JWTPayload } from "./jwt.types.ts"
import type { UserPermission } from "./user-permission.types.ts"

export interface RegisterDto {
    username: string;
    //firstName: string;
    //lastName: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        permissions: UserPermission
    }
}

export interface RefreshResponseDto {
    accessToken: string;
    refreshToken: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface AuthenticatedRequest extends Request {
    user: JWTPayload
}