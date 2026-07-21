export interface RefreshToken {
    id: number;
    sessionId: string;
    userId: number;
    tokenHash: string;
    expiresAt: string;
    createdAt: string;
    lastUsedAt: string;
}