<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-4">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-star mr-2"></i>Bonus Feature Settings
            </h3>
            
            <div class="flex align-items-center justify-content-between p-2 surface-100 border-round">
                <div class="flex flex-column">
                    <span class="font-medium">Enable Bonus Free Spins</span>
                    <small class="text-color-secondary">Allows mechanics to trigger special bonus rounds</small>
                </div>
                <ToggleSwitch v-model="config.HAS_FREE_SPINS" />
            </div>

            <div v-if="config.HAS_FREE_SPINS" class="flex flex-column gap-2 animate-fadein">
                <div class="flex justify-content-between align-items-center">
                    <label class="font-medium">Number of Free Spins Awarded</label>
                    <span class="font-bold text-primary">{{ config.NR_OF_FREE_SPINS }} Spins</span>
                </div>
                <Slider v-model="config.NR_OF_FREE_SPINS" :min="1" :max="25" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type FreeSpins } from '@/types/SlotConfig'

    const config = defineModel<FreeSpins>({ required: true })
</script>