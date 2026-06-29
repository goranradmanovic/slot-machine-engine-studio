<template>
    <div class="grid">
        <ReelLayout v-model="config" />

        <TimingsAndBetting v-model="config" />

        <BonusFeature v-model="config" />

        <Winlines :active="config" />

        <WinlinesEditor v-model="config" />

        <SymbolsTheme v-model="config" />

        <AudioPack v-model="config" />

        <CanvasCustomization v-model="config" />

        <div class="col-12">
            <Button 
                @click="saveChanges" 
                icon="pi pi-save" 
                label="Save Changes" severity="success" 
                :disabled="loading"
                :loading="loading"
                class="mt-2"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, watch, toRaw } from 'vue';
    import { useConfig } from '@/composables/useConfig'
    import ReelLayout from './settings/ReelLayout.vue'
    import TimingsAndBetting from './settings/TimingsAndBetting.vue'
    import BonusFeature from './settings/BonusFeature.vue'
    import Winlines from './settings/Winlines.vue'
    import WinlinesEditor from './settings/WinlinesEditor.vue'
    import SymbolsTheme from './settings/SymbolsTheme.vue'
    import AudioPack from './settings/AudioPack.vue'
    import CanvasCustomization from './settings/CanvasCustomization.vue'
    import { defaultConfig } from '@/utils/default-config.ts';

    const props = defineProps<{
        currentConfig: {
            required: true,
            type: object | string,
            default: () => {}
        }
    }>()

    const emit = defineEmits(['update:config'])

    const { loading } = useConfig()

    // Default config values
    const config = ref(defaultConfig);

    watch(() => props.currentConfig, (newConfig) => {
        if (newConfig && Object.keys(newConfig).length > 0) {
            // toRaw strips the Vue proxy layer, allowing structuredClone to work perfectly
            const rawObj = toRaw(newConfig);
            config.value = structuredClone(rawObj);
        }
    }, { immediate: true, deep: true });

    // Save virtual value chnages
    const saveChanges = () => {
        // Pass a clean, un-proxied deep copy back to the parent
        const cleanData = structuredClone(toRaw(config.value))
        emit('update:config', cleanData)
    }
</script>