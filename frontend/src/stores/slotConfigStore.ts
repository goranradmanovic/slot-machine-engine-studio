import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfig } from '@/composables/useConfig'


export const useSlotConfigStore = defineStore('slotConfig', () => {

  const { fetchConfig } = useConfig()

  const currentUsedVersion = ref<string | null>(null)
  const configVersions = ref<[]>([])

  const currentConfigFile = computed(() => currentUsedVersion.value ? currentUsedVersion.value : 'Default')
  const currentConfigFiles = computed(() => {
    if (configVersions.value.length > 0) {
      return configVersions.value.map((file: { name: string }, index) => {
        return { name: file.name, code: `v${index + 1}` }
      })
    }
  })

  const setConfigVersion = (value: null) => currentUsedVersion.value = value

  const getConfigVersions = async () => configVersions.value = await fetchConfig('files')

  return { currentConfigFiles, currentConfigFile, setConfigVersion, getConfigVersions }
})