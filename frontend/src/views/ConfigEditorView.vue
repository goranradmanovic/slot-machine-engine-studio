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
          <Button
            @click="createConfig()"
            :disabled="isCreateConfig || loading"
            :loading="loading"
            icon="pi pi-plus" 
            label="Create New Config" 
            severity="success" 
          />
        </div>
      </template>

      <div v-if="configData && Object.keys(configData).length > 0" class="flex flex-column gap-2">
        <div class="flex flex-column gap-3 mb-4">
          <Message severity="secondary">
            <h4 class="m-0 font-normal">Edit the JSON configuration below.</h4>
            <h4 class="m-0 font-normal">Editing current file: <span class="font-bold text-primary font-italic">{{ targetFile }}.json</span></h4>
          </Message>

          <Message v-if="statusMessage" :severity="statusType" closable>{{ statusMessage }}</Message>
        </div>

        <Tabs value="0">
          <TabList>
            <Tab value="0"><i class="pi pi-sliders-h mr-2" /> Visual Adjuster</Tab>
            <Tab value="1"><i class="pi pi-code mr-2" /> Raw JSON</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel value="0">
              <VisualAdjuster :current-config="parsedConfig" @update:config="handleConfigUpdate" />
            </TabPanel>
            
            <TabPanel value="1">
                <div class="px-2">
                  <div class="raw-json-editor mb-4">
                    <JsonEditorVue v-model="configData" :mode="'text'" :main-menu-bar="true" />
                  </div>
                  <Button
                    @click="saveConfig()"
                    :disabled="loading"
                    :loading="loading"
                    icon="pi pi-save" 
                    label="Save Changes" 
                    severity="success" 
                  />
                </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <Message v-else severity="secondary">Please select config version</Message>
    </Panel>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, toRaw } from 'vue'
  import JsonEditorVue from 'json-editor-vue'
  import { useToast } from 'primevue/usetoast'
  import { useConfig } from '@/composables/useConfig'
  import AvailableVersions from '@/components/AvailableVersions.vue'
  import VisualAdjuster from '@/components/visual-editor/VisualAdjuster.vue'
  import { defaultConfig } from '@/utils/default-config.ts'
  import { useSlotConfigStore } from '@/stores/slotConfigStore'

  const slotConfigStore = useSlotConfigStore()
  const toast = useToast()
  const { configData, loading, error, fetchConfig } = useConfig()

  const selectedVersion = ref<string | null>(null)
  const statusMessage = ref('')
  const statusType = ref<'success' | 'error' | 'info' | 'warn'>('info')
  
  const targetFile = computed(() => `reels_${selectedVersion.value}`)
  const newFile = computed(() => `reels_v${slotConfigStore.availableConfigVersions.length + 1}`)
  const isCreateConfig = computed(() => slotConfigStore.availableConfigVersions?.length > 0 ? false : true)

  // computed property to guarantee an object format
  const parsedConfig = computed(() => {
    if (typeof configData.value === 'string') {
      try {
        return JSON.parse(configData.value);
      } catch (e) {
        // Fallback to empty object if string is partially typed or invalid JSON
        return {};
      }
    }
    return configData.value || {}
  })

  // Fetch file from backend
  const loadConfig = async () => {
    try {
      statusMessage.value = ''
      await fetchConfig(targetFile.value)
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
      let rawData = paramConfigData || configData.value;
      
      // Strip Vue proxies to ensure it doesn't lock up UI reactivity
      let payload = toRaw(rawData);

      // Handle string formats (from raw JSON editor) vs object formats cleanly
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      } else {
        payload = structuredClone(payload);
      }
    
      await fetchConfig(targetFile.value, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

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

  const createConfig = async () => {
    try {
      statusMessage.value = ''
    
      await fetchConfig(newFile.value, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaultConfig)
      })

      setTimeout(async () => {
        await slotConfigStore.getAvailableConfigVersions()
      }, 1000)

      if (error.value) throw new Error('Server rejected creating new config')

      toast.add({ severity: 'success', summary: 'Saved', detail: 'Configuration created successfully', life: 8000 })
    } catch (err) {
      toast.add({ severity: 'error', summary: 'Creation Failed', detail: (err as Error).message, life: 8000 })
    }
  }

  const handleLoadConfig = async (payload: string) => {
    selectedVersion.value = payload
    await loadConfig()
  }

  const handleConfigUpdate = (payload: object) => {
    saveConfig(payload)
  }
</script>