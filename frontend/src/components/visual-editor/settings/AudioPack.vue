<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-3">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-volume-up mr-2"></i>Audio Sound Pack
            </h3>
            <p class="text-sm text-color-secondary m-0">
                Select the audio effects profile. This changes button clicks, spin hums, and winning celebrations.
            </p>
            
            <div class="flex justify-content-start pt-2">
                <SelectButton 
                    v-model="config.SOUND_TYPE" 
                    :options="soundOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                >
                    <template #option="slotProps">
                        <div class="flex align-items-center gap-2 px-2">
                            <i :class="slotProps.option.icon"></i>
                            <span>{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </SelectButton>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { type Audio } from '@/types/SlotConfig'

    const config = defineModel<Audio>({ required: true })
    
    const soundOptions = ref([
        { label: 'Default Audio', value: 'defaults', icon: 'pi pi-cog' },
        { label: 'Juicy Arcade', value: 'fruits', icon: 'pi pi-star' },
        { label: 'Neon Cyberpunk', value: 'cyberpunk', icon: 'pi pi-bolt' },
        { label: 'Mystic Quest', value: 'fantasy', icon: 'pi pi-sparkles' }
    ])
</script>