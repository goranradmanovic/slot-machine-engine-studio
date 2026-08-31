<template>
    <Dialog v-model:visible="visible" modal :style="{ 'width': '60rem' }" :closable="false" header="AI Response">
        <div class="flex flex-column items-center justify-content-center gap-4">
            <div class="assistant-header">
                <h4 class="text-md font-bold m-0 mb-2">
                    <i class="pi pi-lightbulb mr-2"></i>AI Explanation
                </h4>
                <p class="text-sm text-color-secondary m-0">
                    {{ aiResponse?.explanation }}
                </p>

                <Message v-if="aiResponse?.warnings.length" severity="warn" variant="outlined" class="mt-3">
                    <template #icon>
                        <ExclamationTriangle />
                    </template>
                    <ul class="pl-4">
                        <li v-for="warning in aiResponse?.warnings" :key="warning">
                            {{ warning }}
                        </li>
                    </ul>
                </Message>
            </div>

            <AiConfigChanges :changes="aiResponse?.changes" />
        </div>

        <template #footer>
            <div class="flex gap-2 mt-4">
                <Button
                    @click="closeDialog"
                    severity="warn"
                >
                    <ThumbsDown />
                    Reject
                </Button>

                <Button
                    @click="applyChanges()"
                    severity="success"
                >
                    <ThumnsUp />
                    Apply Configuration
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    import AiConfigChanges from "@/components/ai/AiConfigChanges.vue"

    const props = defineProps<{
        aiResponse: string | undefined,
    }>()

    const emits = defineEmits<{
        (e: 'apply'): void
        (e: 'reject'): void
    }>()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    const closeDialog = () => {
        visible.value = false
        emits('reject')
    }

    const applyChanges = async () => {
        visible.value = false
        emits('apply')
    }
</script>