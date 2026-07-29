import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useUserStore } from './userStore'
import { AuthService } from '@/services/AuthService'


export const useSlotConfigStore = defineStore('slotConfig', () => {
  const userStore = useUserStore()
  const { get } = useApi()

  const currentUsedVersion = ref<string | null>(null)
  const configVersions = ref<[]>([])

  const getConfigVersions = async () => {
    const userId = userStore.getUser?.id
    if (!userId) return

    // Build the query string dynamically with the current user ID
    const queryString = new URLSearchParams({ id: String(userId) }).toString()

    if (!AuthService.isAuthenticated()) return

    configVersions.value = await get(`configs/files?${queryString}`, { requiresAuth: true })
  } 

  // Watch specifically for changes to userStore.getUser?.id
  watch(
    () => userStore.getUser?.id,
    async (newId) => {
      if (newId) {
        await getConfigVersions()
      }
    },
    { immediate: true } // Runs immediately on store creation if user ID already exists
  )

  const currentConfigFile = computed(() => 
    currentUsedVersion.value ? currentUsedVersion.value : 'Default'
  )

  const currentConfigFiles = computed(() => {
    if (configVersions.value.length > 0) {
      return configVersions.value.map((file: { name: string }, index) => ({
        name: file.name,
        code: `v${index + 1}`
      }))
    }
    return []
  })

  const setConfigVersion = (value: string | null) => currentUsedVersion.value = value

  return { 
    currentConfigFiles, 
    currentConfigFile, 
    setConfigVersion, 
    getConfigVersions 
  }
})