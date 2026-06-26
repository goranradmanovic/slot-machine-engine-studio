<template>
    <section class="col-12 md:col-6">
        <div class="surface-card p-4 border-round shadow-1 h-full flex flex-column gap-4">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-th-large mr-2"></i>Reel Layout
            </h3>
            
            <div class="flex flex-column gap-2">
                <div class="flex justify-content-between align-items-center">
                    <label class="font-medium">Reel Count</label>
                    <span class="font-bold text-primary">{{ config.REEL_COUNT }}</span>
                </div>
                <Slider v-model="config.REEL_COUNT" :min="3" :max="10" />
            </div>

            <div class="flex flex-column gap-2">
                <div class="flex justify-content-between align-items-center">
                    <label class="font-medium">Symbols Per Reel</label>
                    <span class="font-bold text-primary">{{ config.SYMBOLS_PER_REEL }}</span>
                </div>
                <Slider v-model="config.SYMBOLS_PER_REEL" :min="1" :max="8" />
            </div>

            <div class="flex flex-column gap-2">
                <label class="font-medium">Symbol Size (px)</label>
                <InputNumber v-model="config.SYMBOL_SIZE" suffix=" px" showButtons :min="50" :max="300" :step="10" />
            </div>

            <div class="flex flex-column gap-2">
                <label class="font-medium">Reel Spacing (px)</label>
                <InputNumber v-model="config.REEL_SPACING" suffix=" px" showButtons :min="0" :max="50" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type ReelLayoutConfig } from '@/types/SlotConfig'

    // Define model binding for seamless two-way parent-child synchronization
    const config = defineModel<ReelLayoutConfig>({ required: true });
</script>