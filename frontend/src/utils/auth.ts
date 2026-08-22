export class Auth {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken'
    private static readonly REFRESH_TOKEN_KEY = 'refreshToken'

    static getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }

    static setAccessToken(accessToken: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }

    static setRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    }

    static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
        }
    }

    static clear(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY)
        localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    }
}