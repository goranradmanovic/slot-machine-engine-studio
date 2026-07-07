import { ref } from 'vue';
import { type SlotConfig } from '@/types/SlotConfig.ts'

export function useConfig() {
  const configData = ref<SlotConfig | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Cleanly safely resolve the endpoint address URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost'
  const port = import.meta.env.VITE_API_PORT ? `:${import.meta.env.VITE_API_PORT}` : '3000'
  const version = import.meta.env.VITE_API_VERSION ? `${import.meta.env.VITE_API_VERSION}` : '/api/v1'
  
  // Ensure there are no double-slashes or missing divider tokens
  const cleanBaseApiUrl = `${baseUrl.replace(/\/$/, '')}${port}${version}`

  // param - is name of the file like reels_v1.json or part of the URL
  const fetchConfig = async (param: string = '', options: RequestInit = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${cleanBaseApiUrl}/configs/${param}`, options)
      
      // Handle HTTP error status codes safely
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status} ${response.statusText}`)
      }

      const data = await response.json();
      configData.value = data;
      return data;
    } catch (err) {
      const errMsg = (err as Error).message || 'Failed to communicate with configuration API'
      console.error(`[useConfig] Error fetching ${param}:`, err)
      error.value = errMsg
      configData.value = null // Clean fallback state
    } finally {
      loading.value = false
    }
  }

  return {
    configData,
    loading,
    error,
    fetchConfig
  }
}