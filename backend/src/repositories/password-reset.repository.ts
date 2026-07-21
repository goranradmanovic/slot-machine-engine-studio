import { getDatabase } from "../database/database.ts"
import type { PasswordResetToken } from "../models/password-reset.model.ts"

export class PasswordResetRepository {

    static async create(userId: number, resetTokenHash: string, expiresAt: string): Promise<void> {
        const db = getDatabase()

        await db.run(
            'INSERT INTO password_reset_tokens (userId, resetTokenHash, expiresAt) VALUES (?, ?, ?)',
            userId,
            resetTokenHash,
            expiresAt
        )
    }

    static async deleteByUserId(userId: number): Promise<void> {
        const db = getDatabase()

        await db.run(
            'DELETE FROM password_reset_tokens WHERE userId = ?',
            userId
        )
    }

    static async findByHash(resetTokenHash: string): Promise<PasswordResetToken | undefined> {
        const db = getDatabase()

        return db.get<PasswordResetToken>(
            'SELECT * FROM password_reset_tokens WHERE resetTokenHash = ?',
            resetTokenHash
        )
    }

    static async markAsUsed(id: number): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE password_reset_tokens SET usedAt = CURRENT_TIMESTAMP WHERE id = ?',
            id
        )
    }

    static async findValidToken(resetTokenHash: string): Promise<void> {
        const db = getDatabase()

        return db.get<PasswordResetToken>(
            'SELECT * FROM password_reset_tokens WHERE resetTokenHash = ?',
            resetTokenHash
        )
    }

    static async cleanup(): Promise<number> {
        const db = getDatabase()

        const result = await db.run('DELETE FROM password_reset_tokens WHERE expiresAt <= CURRENT_TIMESTAMP OR IS NOT NULL')

        return result.changes ?? 0
    }
}