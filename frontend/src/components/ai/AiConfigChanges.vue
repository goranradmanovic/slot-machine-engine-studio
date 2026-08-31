<template>
    <div class="flex flex-column gap-4 ai-config-changes">
        <div class="ai-config-changes__header">
            <h4 class="text-md font-bold m-0 mb-2">
                <i class="pi pi-star mr-2"></i>Configuration Changes
            </h4>
            <p v-if="changes.length === 0" class="no-changes">AI did not make any configuration changes.</p>
            <p v-else class="text-sm text-color-secondary m-0">
                {{ changes.length }} {{ changes.length === 1 ? 'change' : 'changes' }}
            </p>
        </div>
        <Listbox 
            v-if="changes.length !== 0"
            :options="changes"
            optionLabel="label"
            optionValue="value"
            class="w-full ai-config-changes__list"
            listStyle="max-height: 30rem"
            striped
            :pt="{
                option: {
                    class: 'h-8rem pointer-events-none'
                }
            }"
        >
            <template #option="slotProps">
                <div class="flex flex-column items-center gap-2 w-full">
                    <h4 class="text-md m-0">{{ slotProps.option.label }}</h4>
                    <div class="flex align-items-center justify-content-evenly gap-6 py-1 border-y-1 border-50 change-values">
                        <!-- Old value -->
                        <div class="change-value old text-orange-400">
                            <span class="value-label uppercase font-semibold">Before</span>
                            <div class="flex align-items-center justify-content-center gap-1 value-content">
                                <CircleFill v-if="isColorField(slotProps.option.field)" :color="`#${slotProps.option.from}`" />
                                <span>{{ getDisplayValue(slotProps.option, slotProps.option.from) }}</span>
                            </div>
                        </div>

                        <ArrowRight />

                        <!-- New value -->
                        <div class="change-value new text-primary">
                            <span class="value-label uppercase font-semibold">After</span>
                            <div class="flex align-items-center justify-content-center gap-1 value-content">
                                <CircleFill v-if="isColorField(slotProps.option.field)" :color="`#${slotProps.option.to}`" />
                                <span>{{ getDisplayValue(slotProps.option, slotProps.option.to) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Listbox>
    </div>
</template>

<script setup lang="ts">
    import type { ConfigChange } from '@/types/AI.types'

    interface Props { changes: ConfigChange }

    defineProps<Props>()

    function formatValue(value: unknown): string {
        if (value === null || value === undefined) return '-'

        if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled'

        if (typeof value === 'object') return JSON.stringify(value)

        return String(value)
    }

    function isColorField(field: string): boolean {
        return field === 'BACKGROUND_COLOR' || field === 'FRAME_SPINE_BG_COLOR'
    }

    function isTimingField(field: string): boolean {
        return field === 'SPIN_DELAY' ||
           field === 'STOP_SPIN_DELAY' ||
           field === 'SPIN_DURATION' ||
           field === 'CHECK_WIN_DELAY'
    }

    function formatTimingValue(value: unknown): string {
        if (typeof value !== 'number') return formatValue(value)

        return formatValue(value)
    }

    function getDisplayValue(change: ConfigChange, value: unknown): string {
        if (isTimingField(change.field)) return formatTimingValue(value)

        return formatValue(value)
    }
</script>