import { Auth } from '@/utils/auth'

export interface ApiRequestOptions extends RequestInit {
    retry?: boolean
}

class ApiClient {

    private readonly apiUrl: string
    private refreshPromise: Promise<boolean> | null = null

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

        const response = await fetch(
            `${this.apiUrl}/${endpoint}`,
            {
                ...options,
                headers
            }
        )

        // Parse JSON ONLY ONCE
        let body: any = null

        if (response.status !== 204) {
            const contentType = response.headers.get('content-type')

            if (contentType?.includes('application/json')) {
                body = await response.json()
            }
        }

        if (response.status === 401 && retry) {

            if (!Auth.getRefreshToken()) {
                throw new Error(body?.message ?? 'Unauthorized')
            }

            const refreshed = await this.refreshToken()

            console.log('Token refreshed API CLINET:', refreshed)
            if (refreshed) {
                return this.request<T>(
                    endpoint,
                    {
                        ...options,
                        retry: false
                    }
                )
            }

            Auth.clear()

            throw new Error(body?.message ?? 'Session expired.')
        }

        if (!response.ok) {
            throw new Error(body?.message ?? response.statusText)
        }

        return body as T
    }

    private refreshToken(): Promise<boolean> {
        if (this.refreshPromise) {
            return this.refreshPromise
        }

        this.refreshPromise = this.doRefresh()

        return this.refreshPromise.finally(() => {
            this.refreshPromise = null
        })
    }

    private async doRefresh(): Promise<boolean> {
        const refreshToken = Auth.getRefreshToken()

        if (!refreshToken) return false

        const response = await fetch(`${this.apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })

        if (!response.ok) return false

        const json = await response.json()

        Auth.setAccessToken(json.data.accessToken)

        if (json.data.refreshToken) {
            Auth.setRefreshToken(json.data.refreshToken)
        }

        return true
    }
}

export const apiClient = new ApiClient()