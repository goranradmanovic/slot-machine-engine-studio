import { ref, computed } from 'vue'
import { apiClient } from '@/api/ApiClient.ts'

export function useApi() {
    const activeRequests = ref<number>(0)

    const loading = computed(() => activeRequests.value > 0)

    const error = ref<string | null>(null)

    const clearError = () => error.value = null

    async function execute<T>(action: () => Promise<T>): Promise<T> {
        activeRequests.value++
        error.value = null

        try {
            return await action()
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error.'
            throw err
        }
        finally {
            activeRequests.value--
        }
    }

    return {
        loading,
        error,
        execute,
        clearError,
        get: <T>(url: string) => execute(() => apiClient.get<T>(url)),
        post: <T>(url: string, body?: unknown) => execute(() => apiClient.post<T>(url, body)),
        put: <T>(url: string, body?: unknown) => execute(() => apiClient.put<T>(url, body)),
        patch: <T>(url: string, body?: unknown) => execute(() => apiClient.patch<T>(url, body)),
        delete: <T>(url: string) => execute(() => apiClient.delete<T>(url))
    }
}