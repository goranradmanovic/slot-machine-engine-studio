<template>
  <div class="config-editor-view">
    <Panel>
      <template #header>
        <h2 class="text-2xl font-bold">Slot Machine Editing Tool</h2>
      </template>

      <div class="flex flex-column gap-4">
        <div>
          <p class="text-color-secondary mt-1 w-20rem">
            This tool allows you to edit and save different configurations to the file.
          </p>
        </div>

        <AvailableVersions @load-config="handleLoadConfig" btn-label="Edit" />
      </div>
    </Panel>

    <Panel class="w-full">
      <template #header>
        <div class="flex gap-2 align-items-center justify-content-between w-full">
          <h2 class="text-2xl font-bold">Config Editor</h2>
        </div>
      </template>

      <div v-if="data && Object.keys(data).length > 0" class="flex flex-column gap-2">
        <div class="flex flex-column gap-3 mb-4">
          <Message severity="secondary">
            <h4 class="m-0 font-normal">Edit the JSON configuration below.</h4>
            <h4 class="m-0 font-normal">Editing current file: <span class="font-bold text-primary font-italic">{{ selectedVersion }}</span></h4>
          </Message>

          <Message v-if="statusMessage" :severity="statusType" closable>{{ statusMessage }}</Message>
        </div>

        <Tabs value="0">
          <TabList>
            <Tab value="0"><i class="pi pi-microchip-ai mr-2" /> AI Assistant</Tab>
            <Tab value="1"><i class="pi pi-sliders-h mr-2" /> Visual Adjuster</Tab>
            <Tab value="2"><i class="pi pi-code mr-2" /> Raw JSON</Tab>
            <Tab value="3"><i class="pi pi-wave-pulse mr-2" /> Engine Math Simulator</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel value="0">
              <AiConfigAssistant :config="parsedConfig" @update:config="handleConfigApply" @undo:config="handleConfigUndo" />
            </TabPanel>

            <TabPanel value="1">
              <VisualAdjuster :current-config="parsedConfig" @update:config="handleConfigUpdate" />
            </TabPanel>
            
            <TabPanel value="2">
                <div class="px-2">
                  <div class="raw-json-editor mb-4">
                    <JsonEditorVue v-model="data" :mode="'text'" :main-menu-bar="true" />
                  </div>
                  <Button
                    @click="saveConfig()"
                    :disabled="loading"
                    :loading="loading"
                    severity="success" 
                  >
                    <Save />
                    Save Changes
                  </Button>
                </div>
            </TabPanel>

            <TabPanel value="3">
              <EngineSimulator :config="parsedConfig" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Message v-else severity="secondary">Please select config version</Message>
    </Panel>

    <ConfirmConfigDialog v-model:visible="confirmDialog" :is-undo="undoAiConfig" @save="saveAiGeneratedConfig" @undo="undoAiGeneratedConfig" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, toRaw } from 'vue'
  import JsonEditorVue from 'json-editor-vue'
  import { useToast } from 'primevue/usetoast'
  import { useApi } from '@/composables/useApi'
  import { useUserStore } from '@/stores/userStore'
  import AvailableVersions from '@/components/AvailableVersions.vue'
  import VisualAdjuster from '@/components/visual-editor/VisualAdjuster.vue'
  import AiConfigAssistant from '@/components/ai/AiConfigAssistant.vue'
  import EngineSimulator from '@/components/simulation-dashboard/EngineSimulator.vue'
  import ConfirmConfigDialog from '@/components/dialogs/config/ConfirmConfigDialog.vue'

  const toast = useToast()
  const data = ref<{} | null>(null)
  const { loading, error, get, patch } = useApi()
  const userStore = useUserStore()
  const userId = userStore.getUser?.id
  const qeuryString = new URLSearchParams({ id: String(userId) }).toString()

  const selectedVersion = ref<string>('')
  const statusMessage = ref<string>('')
  const statusType = ref<'success' | 'error' | 'info' | 'warn'>('info')
  const confirmDialog = ref<boolean>(false)
  const undoAiConfig = ref<boolean>(false)
  let aiGeneratedConfig = <object | null> null
  let previousConfig = <object | null> null

  // computed property to guarantee an object format
  const parsedConfig = computed(() => {
    if (typeof data.value === 'string') {
      try {
        return JSON.parse(data.value)
      } catch (e) {
        // Fallback to empty object if string is partially typed or invalid JSON
        return {};
      }
    }
    return data.value || {}
  })

  // Fetch file from backend
  const loadConfig = async () => {
    try {
      statusMessage.value = ''

      data.value = await get(`configs/files/${selectedVersion.value}?${qeuryString}`)
      previousConfig = structuredClone(toRaw(data.value))

      if (error.value) throw new Error('Could not find or read config file')
    } catch (err) {
      statusType.value = 'error'
      statusMessage.value = (err as Error).message
      throw err // Re-throw so form handler captures the failure state
    }
  }

  const saveConfig = async (paramConfigData?: unknown) => {
    try {
      statusMessage.value = ''

      // If paramConfigData is provided (from child component), use it. Otherwise, fall back to using the local configData state.
      let rawData = paramConfigData || data.value;
      
      // Strip Vue proxies to ensure it doesn't lock up UI reactivity
      let payload = toRaw(rawData)

      // Handle string formats (from raw JSON editor) vs object formats cleanly
      if (typeof payload === 'string') {
        payload = JSON.parse(payload)
      } else {
        payload = structuredClone(payload)
      }

      const response = await patch(`configs/files/${selectedVersion.value}`, { id: userId, data: payload })
      data.value = response?.data

      if (error.value) throw new Error('Server rejected saving changes')

      statusType.value = 'success'
      statusMessage.value = 'Configuration saved successfully!'
      toast.add({ severity: 'success', summary: 'Saved', detail: 'Changes saved to file.', life: 4000 })
    } catch (err) {
      statusType.value = 'error'
      statusMessage.value = (err as Error).message
      toast.add({ severity: 'error', summary: 'Save Failed', detail: (err as Error).message, life: 4000 })
    }
  }

  const handleLoadConfig = async (payload: string) => {
    selectedVersion.value = payload
    await loadConfig()
  }

  const handleConfigUpdate = (payload: object) => {
    saveConfig(payload)
  }

  const handleConfigApply = (payload: object) => {
    aiGeneratedConfig = payload
    confirmDialog.value = true
  }

  const handleConfigUndo = () => {
    undoAiConfig.value = true
    confirmDialog.value = true
  }

  const saveAiGeneratedConfig = () => {
    saveConfig(aiGeneratedConfig)
    confirmDialog.value = false
  }

  const undoAiGeneratedConfig = () => {
    saveConfig(previousConfig)
    undoAiConfig.value = false
  }
</script>