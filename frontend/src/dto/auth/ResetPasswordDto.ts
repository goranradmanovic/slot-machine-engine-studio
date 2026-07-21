export interface ResetPasswordDto {
    token: string | null;
    password: string;
    confirmPassword: string;
}