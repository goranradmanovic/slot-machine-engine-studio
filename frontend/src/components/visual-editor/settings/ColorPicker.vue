<template>
    <InputColor v-model="cleanedColorValue" format="hex">
        <InputColorSwatch @click="(e) => op.toggle(e)" style="cursor: pointer">
            <InputColorTransparencyGrid />
            <InputColorSwatchBackground />
        </InputColorSwatch>
        
        <Popover ref="op">
            <div class="flex flex-column gap-2 w-72 p-3">
                <InputColorArea>
                    <InputColorAreaBackground />
                    <InputColorAreaHandle />
                </InputColorArea>
                <InputColorSlider>
                    <InputColorTransparencyGrid />
                    <InputColorSliderTrack />
                    <InputColorSliderHandle />
                </InputColorSlider>
                <InputColorSlider channel="alpha">
                    <InputColorTransparencyGrid />
                    <InputColorSliderTrack />
                    <InputColorSliderHandle />
                </InputColorSlider>
                <div class="flex items-center gap-2">
                    <InputColorInput channel="hex" class="flex-1" />
                    <InputColorEyeDropper iconOnly severity="secondary" variant="outlined">
                        <template #icon>
                            <EyeDropper />
                        </template>
                    </InputColorEyeDropper>
                </div>
            </div>
        </Popover>
    </InputColor>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'

    const value = defineModel<string>({ required: true })
    const op = ref<null>(null)

    const cleanedColorValue = computed({
        get: () => value.value,
        set: (val: string) => value.value = val.replaceAll('#', '')
    })
</script>