<template>
    <section class="col-12 md:col-6">
        <div class="surface-card p-4 border-round shadow-1 h-full flex flex-column gap-4">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-clock mr-2"></i>Timings & Betting
            </h3>
            
            <div class="grid">
                <div class="col-12 sm:col-6 flex flex-column gap-2">
                    <label class="font-medium">Spin Duration</label>
                    <InputNumber v-model="config.SPIN_DURATION" suffix=" ms" showButtons :step="100" :min="200" />
                </div>
                <div class="col-12 sm:col-6 flex flex-column gap-2">
                    <label class="font-medium">Spin Delay</label>
                    <InputNumber v-model="config.SPIN_DELAY" suffix=" ms" showButtons :step="50" :min="0" />
                </div>
                <div class="col-12 sm:col-6 flex flex-column gap-2">
                    <label class="font-medium">Stop Spin Delay</label>
                    <InputNumber v-model="config.STOP_SPIN_DELAY" suffix=" ms" showButtons :step="50" :min="0" />
                </div>
                <div class="col-12 sm:col-6 flex flex-column gap-2">
                    <label class="font-medium">Win Check Delay</label>
                    <InputNumber v-model="config.CHECK_WIN_DELAY" suffix=" ms" showButtons :step="50" :min="0" />
                </div>
            </div>

            <div class="flex flex-column gap-2 pt-2 border-top-1 surface-border">
                <label class="font-medium">Base Bet Amount</label>
                <InputNumber v-model="config.BET" mode="currency" currency="USD" locale="en-US" showButtons />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type TimingsBetting } from '@/types/SlotConfig'

    const config = defineModel<TimingsBetting>({ required: true })
</script>