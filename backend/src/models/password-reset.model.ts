export interface PasswordResetToken {
    id: number;
    userId: number;
    resetTokenHash: string;
    expiresAt: string;
    createdAt: string;
    usedAt: string;
}