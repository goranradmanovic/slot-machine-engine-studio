<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-3">
            <h3 class="text-xl font-bold m-0 text-primary mb-2">
                <i class="pi pi-table mr-2"></i>Active Winlines ({{ props.active.WINLINES.length }})
            </h3>
            <div class="flex flex-wrap gap-2">
                <div 
                    v-for="line in props.active.WINLINES" 
                    :key="line.id" 
                    class="px-3 py-2 border-1 surface-border border-round bg-surface-50 flex align-items-center gap-3"
                >
                    <span class="font-bold text-sm">Line #{{ line.id }}</span>
                    <span class="text-xs text-color-secondary bg-surface-200 px-2 py-1 border-round font-mono">
                        {{ line.line.filter(v => v === 1).length }} Hits
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type ActiveWinlines } from '@/types/SlotConfig'

    const props = withDefaults(
        defineProps<{
            active:  ActiveWinlines,
        }>(),
        {
            active: () => ({ WINLINES: [] })
        }
    )
</script>