<template>
    <Dialog v-model:visible="visible" modal :closable="false" :header="`${contentTxt} your AI config changes`" :style="{ width: '26rem' }">
        <div class="flex flex-column gap-4">
            <p class="text-surface-500 dark:text-surface-400 text-sm mt-0 mb-0">{{ `Are you sure you want to ${contentTxt.toLowerCase()} AI generated config changes?` }}</p>
            <div class="flex justify-content-end gap-2">
                <Button severity="secondary" @click="closeDialog">Cancel</Button>
                <Button
                    @click="emitEvent"
                    severity="success"
                >
                    <Undo v-if="isUndo" />
                    <Save v-else />
                    {{ contentTxt }} Configuration
                </Button>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        isUndo: boolean
    }>()

    const emits = defineEmits<{
        (e: 'save'): void
        (e: 'undo'): void
    }>()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    const contentTxt = computed(() => props.isUndo ? 'Undo' : 'Save')

    const closeDialog = () => {
        visible.value = false
    }

    const emitEvent = async () => {
        props.isUndo ? emits('undo') : emits('save')
        closeDialog()
    }
</script>