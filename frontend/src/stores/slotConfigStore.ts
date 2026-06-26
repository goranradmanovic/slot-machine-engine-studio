import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSlotConfigStore = defineStore('slotConfig', () => {
  const slotConfigVersion = ref<string | null>(null)

  const slotConfigFile = computed(() => slotConfigVersion.value ? `reels_${slotConfigVersion.value}.json` : 'Default')

  const setConfigVersion = (value: null) => slotConfigVersion.value = value

  return { slotConfigVersion, slotConfigFile, setConfigVersion }
})