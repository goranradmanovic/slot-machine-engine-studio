export interface ChangePasswordDto {
    id: number;
    password: string;
    confirmPassword: string;
    currentPassword: string;
}