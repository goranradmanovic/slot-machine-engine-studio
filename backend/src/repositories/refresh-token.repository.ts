import { getDatabase } from "../database/database.ts"

export class RefreshTokenRepository {

    static async create(sessionId: string, userId: number, tokenHash: string, expiresAt: string): Promise<void> {
        const db = getDatabase()

        await db.run(
            'INSERT INTO refresh_tokens (sessionId, userId, tokenHash, expiresAt) VALUES (?, ?, ?, ?)',
            sessionId,
            userId,
            tokenHash,
            expiresAt
        )
    }

    static async findSession(tokenHash: string) {
        const db = getDatabase()

        return db.get(
            `
                SELECT rt.sessionId, rt.userId, rt.expiresAt, u.id, u.username, u.email
                FROM refresh_tokens rt
                INNER JOIN users u 
                ON u.id = rt.userId
                WHERE rt.tokenHash = ?
            `,
            tokenHash
        )
    }

    static async deleteBySessionId(sessionId: string): Promise<void> {
        const db = getDatabase()

        await db.run('DELETE FROM refresh_tokens WHERE sessionId = ?', sessionId)
    }

    static async deleteAllForUser(userId: number): Promise<void> {
        const db = getDatabase()

        await db.run('DELETE FROM refresh_tokens WHERE userId = ?', userId)
    }

    static async updateLastUsed(sessionId: string): Promise<void> {
        const db = getDatabase()

        await db.run('UPDATE refresh_tokens SET lastUsedAt = CURRENT_TIMESTAMP WHERE sessionId = ?', sessionId)
    }

    static async deleteByUserId(userId: number): Promise<void> {
        const db = getDatabase()

        await db.run('DELETE FROM refresh_tokens WHERE userId = ?', userId)
    }

    static async cleanup(): Promise<number> {
        const db = getDatabase()

        const result = await db.run('DELETE FROM refresh_tokens WHERE expiresAt <= CURRENT_TIMESTAMP')

        return result.changes ?? 0
    }
}