export function parseJsonArray<T>(jsonString: string | null | undefined, fallback = []): T[] {
    if (!jsonString) return fallback

    try {
        const parsed = JSON.parse(jsonString)
        return Array.isArray(parsed) ? parsed : fallback
    } catch {
        return fallback
    }
}