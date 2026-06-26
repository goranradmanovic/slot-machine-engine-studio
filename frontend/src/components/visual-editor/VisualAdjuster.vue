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
    const config = ref({
        "REEL_COUNT": 5,
        "SYMBOLS_PER_REEL": 3,
        "SYMBOL_SIZE": 120,
        "SYMBOLS_TYPE": "defaults",
        "SOUND_TYPE": "defaults",
        "BACKGROUND_COLOR": "1099bb", // Hex string format without #
        "FRAME_SPINE_BG_COLOR": "000000",
        "FRAME_SPINE_BG_COLOR_OPACITY": 0,
        "REEL_SPACING": 8,
        "HAS_FREE_SPINS": true,
        "NR_OF_FREE_SPINS": 10,
        "SPIN_DELAY": 200,
        "STOP_SPIN_DELAY": 200,
        "SPIN_DURATION": 1800,
        "CHECK_WIN_DELAY": 600,
        "BET": 10,
        "WINLINES": [
            { "id": 1, "line": [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0] },
            { "id": 2, "line": [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0] },
            { "id": 3, "line": [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0] },
            { "id": 4, "line": [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0] },
            { "id": 5, "line": [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0] },
            { "id": 6, "line": [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1] },
            { "id": 7, "line": [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0] },
            { "id": 8, "line": [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1] }
        ]
    });

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