<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-4">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-images mr-2"></i>Symbols Art Theme
            </h3>
            <p class="text-sm text-color-secondary m-0">
                Choose the graphic skin pack loaded onto the slot reels. Changing this asset kit updates game visual theme profiles.
            </p>
            
            <div class="flex justify-content-start pt-2">
                <SelectButton 
                    v-model="config.SYMBOLS_TYPE" 
                    :options="themeOptions" 
                    optionLabel="label" 
                    optionValue="value" 
                    aria-labelledby="basic" 
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
    import { type Symbols } from '@/types/SlotConfig'

    const config = defineModel<Symbols>({ required: true })

    const themeOptions = ref([
        { label: 'Default Graphics', value: 'defaults', icon: 'pi pi-cog' },
        { label: 'Fruits Graphics', value: 'fruits', icon: 'pi pi-apple' },
        { label: 'Egyptians Graphics', value: 'egyptians', icon: 'pi pi-sun' },
        { label: 'Sports Graphics', value: 'sports', icon: 'pi pi-globe' }
    ])
</script>