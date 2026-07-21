import { hashToken } from "../utils/crypto.ts"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.ts"

export class SessionService {

    static async logout(refreshToken: string): Promise<void> {
        
        const hash = hashToken(refreshToken)
        const session = await RefreshTokenRepository.findSession(hash)

        if (!session) return

        await RefreshTokenRepository.deleteBySessionId(session.sessionId)
    }

    static async logoutAll(userId: number): Promise<void> {
        await RefreshTokenRepository.deleteAllForUser(userId)
    }
}