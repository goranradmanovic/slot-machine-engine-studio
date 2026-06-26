<template>
    <section class="col-12">
        <div class="surface-card p-4 border-round shadow-1 flex flex-column gap-4">
            <h3 class="text-xl font-bold m-0 text-primary">
                <i class="pi pi-palette mr-2"></i>Canvas Customization
            </h3>
            
            <div class="flex gap-2">
                <div class="col-12 md:col-6 flex flex-column gap-3">
                    <label class="font-medium">Game Stage Background Color</label>
                
                    <div class="flex align-items-center gap-3 p-3 bg-surface-50 border-round border-1 surface-border">
                        <ColorPicker v-model="config.BACKGROUND_COLOR" format="hex" />
                        
                        <div class="flex flex-column gap-1">
                            <span class="font-mono font-bold text-sm">
                                #{{ config.BACKGROUND_COLOR }}
                            </span>
                            <small class="text-xs text-color-secondary">
                                Click the color box to open the spectrum grid palette
                            </small>
                        </div>
                    </div>
                </div>

                <div class="col-12 md:col-6 flex flex-column gap-3">
                    <label class="font-medium">Game Frame Background Color & Opacity</label>
                
                    <div class="flex align-items-center gap-3 p-3 bg-surface-50 border-round border-1 surface-border">
                        <div class="flex align-items-center gap-3 p-3">
                            <ColorPicker v-model="config.FRAME_SPINE_BG_COLOR" format="hex" />
                            
                            <div class="flex flex-column gap-1">
                                <span class="font-mono font-bold text-sm">
                                    #{{ config.FRAME_SPINE_BG_COLOR }}
                                </span>
                                <small class="text-xs text-color-secondary">
                                    Click the color box to open the spectrum grid palette
                                </small>
                            </div>
                        </div>
                        <div class="flex align-items-center gap-3 p-3">
                            <InputNumber v-model="config.FRAME_SPINE_BG_COLOR_OPACITY" showButtons buttonLayout="vertical" style="width: 3rem" :step=".1" :min="0" :max="1" />
                            
                            <div class="flex flex-column gap-1">
                                <span class="font-mono font-bold text-sm">
                                    Opacity Alpha Chanel: {{ config.FRAME_SPINE_BG_COLOR_OPACITY }}
                                </span>
                                <small class="text-xs text-color-secondary">
                                    Set the opacity of the background color of the game frame
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { type Canvas } from '@/types/SlotConfig'

    const config = defineModel<Canvas>({ required: true })
</script>