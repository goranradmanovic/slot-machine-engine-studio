import { Auth } from '@/utils/auth'

export interface ApiRequestOptions extends RequestInit {
    retry?: boolean
}

class ApiClient {

    private readonly apiUrl: string

    constructor() {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost'

        const port = import.meta.env.VITE_API_PORT
            ? `:${import.meta.env.VITE_API_PORT}`
            : ':3000'

        const version = import.meta.env.VITE_API_VERSION || '/api/v1'

        this.apiUrl = `${baseUrl.replace(/\/$/, '')}${port}${version}`
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint)
    }

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: JSON.stringify(body)
            }
        )
    }

    async put<T>(endpoint: string, body?: unknown): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PUT',
                body: JSON.stringify(body)
            }
        )
    }

    async patch<T>(endpoint: string, body?: unknown): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PATCH',
                body: JSON.stringify(body)
            }
        )
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'DELETE'
            }
        )
    }

    private async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {

        const retry = options.retry ?? true

        const headers = new Headers(options.headers)

        headers.set('Content-Type', 'application/json')

        const token = Auth.getAccessToken()

        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        const response = await fetch(`${this.apiUrl}/${endpoint}`, { ...options, headers })

        if (response.status === 401 && retry) {
            const refreshed = await this.refreshToken()

            if (refreshed) {
                return this.request<T>(
                    endpoint,
                    {
                        ...options,
                        retry: false
                    }
                )
            }

            this.userError(response) // Throw an error if user put wrong email/password
            
            Auth.clear()

            window.location.href = '/login'

            throw new Error('Session expired.')
        }

        this.userError(response) // Throw an error if user put wrong email/password

        // No content
        if (response.status === 204) {
            return undefined as T
        }

        return await response.json()
    }

    private async refreshToken(): Promise<boolean> {

        const refreshToken = Auth.getRefreshToken()

        if (!refreshToken) {
            return false
        }

        const response = await fetch(
            `${this.apiUrl}/auth/refresh`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            }
        )

        if (!response.ok) {
            return false
        }

        const json = await response.json()

        Auth.setAccessToken(json.data.accessToken)

        return true
    }

    // Helper function
    private async userError(res: {} | any): Promise<void> {
        if (!res.ok) {
            let message = res.statusText

            try {
                const json = await res.json()
                message = json.message ?? message
            }
            catch {}

            throw new Error(message)
        }
    }
}

export const apiClient = new ApiClient()