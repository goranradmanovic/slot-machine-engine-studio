<template>
    <footer class="py-4">
        <div class="flex flex-column md:flex-row justify-content-between align-items-center gap-3">
            <div class="flex align-items-center gap-2 text-sm text-color-secondary">
                <i class="pi pi-shield text-primary"></i>
                <span>&copy; {{ currentYear }} Slot Config Studio. All rights reserved.</span>
            </div>
            <div class="flex align-items-center gap-2">
                <Tag severity="info" class="font-mono text-xs">
                    <i class="pi pi-server mr-1"></i> http://localhost:5173
                </Tag>
                <Tag :severity="isConfigLoaded ? 'success' : 'warn'" class="font-mono text-xs">
                    <i class="pi pi-file mr-1"></i> {{ activeFileLabel }}
                </Tag>
            </div>
            <div class="flex align-items-center gap-3 text-xs text-color-secondary font-mono">
                <span class="flex align-items-center gap-1">
                    <i class="pi pi-code"></i> Config Tool: v1.0.0
                </span>
                <span class="text-300">|</span>
                <span class="flex align-items-center gap-1">
                    <i class="pi pi-desktop"></i> PixiJS: v7.3.2
                </span>
            </div>
        </div>
    </footer>
</template>

<script setup>
    import { computed } from 'vue'
    import { useSlotConfigStore } from '@/stores/slotConfigStore'

    const slotConfigStore = useSlotConfigStore()
    const currentYear = computed(() => new Date().getFullYear())
    const selectedVersion = computed(() => slotConfigStore.currentConfigFile)
    const isConfigLoaded = computed(() => !!selectedVersion.value)
    const activeFileLabel = computed(() => isConfigLoaded.value ? slotConfigStore.currentConfigFile : 'Default config loaded')
</script>