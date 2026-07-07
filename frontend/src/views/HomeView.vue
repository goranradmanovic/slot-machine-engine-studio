<template>
  <div class="home p-2">
    <Splitter class="w-full" >
      <SplitterPanel class="flex items-center justify-center p-3" :size="22" :minSize="5">
          <div class="flex flex-column gap-4">
            <div>
              <h2 class="text-2xl font-bold">Slot Config Tool</h2>
              <p class="text-color-secondary mt-1 w-20rem">
                This tool allows you to apply different slot configurations to the game.
                Select a version from the dropdown and click "Apply" to load the configuration in the game.
              </p>
            </div>

            <AvailableVersions @load-config="handleLoadConfig" />
          </div>
      </SplitterPanel>
      <SplitterPanel class="flex items-center justify-center p-3" :size="79">
        <div class="flex flex-column gap-4 w-full">
          <div>
            <h2 class="text-2xl font-bold">Game Frame</h2>
            <p class="text-color-secondary mt-1">
              The game will be displayed below. The selected configuration will be applied to the game.
            </p>
          </div>
          <iframe ref="gameFrame" src="http://localhost:9000" class="w-full border-none" ></iframe>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useToast } from 'primevue/usetoast'
  import AvailableVersions from '@/components/AvailableVersions.vue'
  import { useGameStore } from '@/stores/gameStore'

  const gameStore = useGameStore()
  const toast = useToast()
  const gameFrame = ref<HTMLIFrameElement | null>(null)

  const applyVersion = selectedVersion => {
    if (!selectedVersion) return

    gameFrame.value?.contentWindow?.postMessage(
      {
        type: 'LOAD_CONFIG',
        version: selectedVersion
      },
      '*'
    )
  }

  // Named handler function to allow effective lifecycle teardown
  const handleGameResponse = (event: MessageEvent) => {
    if (event.data?.type === 'CONFIG_APPLIED') {
      let status = event.data.success 
        ? { severity: 'success', summary: 'Configuration Applied Successfully' } 
        : { severity: 'error', summary: 'Failed to Apply Configuration' }
        
      toast.add({
        severity: event.data.success ? 'success' : 'error',
        summary: event.data.success ? 'Applied' : 'Failed',
        detail: status.summary,
        life: 3000
      })
    }
  }

  const handleLoadConfig = async (payload: string) => {
    applyVersion(payload)
  }

  onMounted(() => {
    window.addEventListener('message', handleGameResponse)

    if (gameFrame.value) {
      gameStore.setGameFrame(gameFrame)
    }
  })

  onBeforeUnmount(() => {
    // Clear event listener to avoid component instance memory leaks
    window.removeEventListener('message', handleGameResponse)
    gameStore.setGameFrame(null) // Clean up the reference
  })
</script>