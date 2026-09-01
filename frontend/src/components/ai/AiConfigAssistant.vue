<template>
    <div class="grid">
        <section class="col-12 md:col-12">
            <div class="surface-card p-4 border-round shadow-1 h-full flex flex-column gap-4">
                <div class="assistant-header">
                    <h3 class="text-xl font-bold m-0 text-primary">
                        <i class="pi pi-sparkles mr-2"></i>AI Config Assistant
                    </h3>
                    <p class="text-sm text-color-secondary m-0">
                        Describe the changes you want to make to your slot configuration.
                    </p>
                </div>

                <div class="flex flex-column gap-4 prompt-section">
                    <Message v-if="error" severity="error" variant="outlined" closable>
                        <template #icon>
                            <ExclamationTriangle />
                        </template>
                        <p>{{ error }}</p>
                        <p>Something went wrong. Please try again.</p>
                    </Message>

                    <FloatLabel variant="on">
                        <Textarea
                            id="on_label"
                            v-model="prompt"
                            rows="8" 
                            cols="30" 
                            fluid
                            style="resize: none" 
                            class="h-full" 
                            placeholder="Example: Make this a 5x3 slot with 15 free spins and a dark blue background." 
                            :disabled="loading"/>
                        <label for="on_label">What would you like to change?</label>
                    </FloatLabel>
                </div>

                <div>
                    <p class="text-sm text-color-secondary mb-2">AI Suggestions</p>
                    <div class="flex justify-center flex-wrap gap-2 prompt-suggestions">
                        <Button
                            v-for="suggestion in suggestions"
                            :key="suggestion"
                            @click="prompt = suggestion"
                            variant="outlined"
                        >
                            {{ suggestion }}
                        </Button>
                    </div>
                </div>

                <Divider />
                
                <!-- Actions -->
                <div class="flex gap-2 assistant-actions">
                    <Button
                        :disabled="loading || !prompt.trim() || error !== null"
                        @click="generateConfig"
                        severity="success" 
                    >
                        <Spinner v-if="loading" spin />
                        <Lightbulb v-else />
                        {{ loading ? 'Generating...' : 'Generate Config' }}
                    </Button>

                    <Button
                        v-if="(result && prompt.trim()) || error !== null"
                        @click="clearAssistant"
                        severity="warn" 
                    >
                        <Eraser />
                        Clear Prompt
                    </Button>

                    <Button
                        v-if="isConfigChanges || error !== null"
                        @click="undoGeneratedConfig"
                        severity="contrast"
                    > 
                        <Undo />
                        Undo AI config
                    </Button>
                </div>
            </div>
        </section>

        <AiResponseDialog v-model:visible="isAiDialogVisible" :ai-response="result" @reject="clearResult" @apply="applyGeneratedConfig" />
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useApi } from '@/composables/useApi'
    import { AiService } from '@/services/AiService'
    import type { SlotConfig } from '@/types/SlotConfig'
    import type { GenerateConfigResponse } from '@/types/AI.types'
    import { validateSlotConfig } from '@/utils/slot-config-validator.ts'
    import AiResponseDialog from '../dialogs/ai/AiResponseDialog.vue'

    interface Props { config: SlotConfig }

    const props = defineProps<Props>()
    const emit = defineEmits(['update:config', 'undo:config'])
    
    const isAiDialogVisible = ref<boolean>(false)
    const prompt = ref<string>('')
    const result = ref<GenerateConfigResponse | null>(null)
    const { loading, error, clearError, execute } = useApi()

    const isConfigChanges = computed(() => result.value?.changes)

    const suggestions = [
        'Make this a 5x3 slot',
        'Set 15 free spins',
        'Change the background to dark blue',
        'Make the slot faster',
        'Create 10 paylines for this configuration',
        'Set bet to 20',
        'Disable free spins'
    ]

    async function generateConfig(): Promise<void> {
        
        if (!prompt.value.trim()) return

        clearError()
        result.value = null

        try {
            let response = await execute(() => AiService.generateConfig({ prompt: prompt.value.trim(), config: props.config }))
            result.value = response?.data || null
            
            if (result.value !== null) {
                isAiDialogVisible.value = true
            }
        } catch (err) {
            console.error('[AI Config Assisten] ', err)
        }
    }

    function clearAssistant(): void {
        prompt.value = ''
        clearError()
    }

    function clearResult(): void {
        result.value = null
        clearAssistant()
    }

    async function applyGeneratedConfig(): Promise<void> {
        if (!result.value) return

        error.value = null

        const validation = validateSlotConfig(result.value.config)

        if (!validation.valid) {
            error.value = `Cannot apply configuration: ${validation.errors.join(' ')}`
            return
        }

        emit('update:config', result.value.config)
        clearAssistant()
    }

    const undoGeneratedConfig = () => {
        emit('undo:config')
        result.value = null
    }
</script>