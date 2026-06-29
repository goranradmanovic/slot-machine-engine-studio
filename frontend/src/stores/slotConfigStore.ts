import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useConfig } from '@/composables/useConfig'


export const useSlotConfigStore = defineStore('slotConfig', () => {

  const { fetchConfig } = useConfig()

  const slotConfigVersion = ref<string | null>(null)
  const availableConfigVersions = ref<[]>([])

  const slotConfigFile = computed(() => slotConfigVersion.value ? `reels_${slotConfigVersion.value}.json` : 'Default')

  const setConfigVersion = (value: null) => slotConfigVersion.value = value

  const getAvailableConfigVersions = async () => availableConfigVersions.value = await fetchConfig()

  return { slotConfigVersion, availableConfigVersions, slotConfigFile, setConfigVersion, getAvailableConfigVersions }
})