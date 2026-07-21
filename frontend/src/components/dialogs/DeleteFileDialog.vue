<template>
    <Dialog v-model:visible="visible" modal :closable="false" header="Delete your config file" :style="{ width: '26rem' }">
        <div class="flex flex-column gap-4">
            <p class="text-surface-500 dark:text-surface-400 text-sm mt-0 mb-0">This action cannot be undone. All of your config data, including config file, and settings will be permanently removed.</p>
            <div class="flex justify-content-end gap-2">
                <Button severity="secondary" @click="closeDialog">Cancel</Button>
                <Button severity="danger" @click="deleteFile">
                    <Spinner v-if="loading" class="animate-spin" />
                    Delete
                </Button>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
    import { useApi } from '@/composables/useApi'
    import { useToast } from 'primevue/usetoast'
    import { useUserStore } from '@/stores/userStore'
    
    const props = defineProps<{
        filename: string
    }>()

    const emits = defineEmits<{
        (e: 'deleted'): void
    }>()

    const { loading } = useApi()
    const toast = useToast()
    const userStore = useUserStore()

    const userId = userStore.getUser?.id
    const qeuryString = new URLSearchParams({ id: String(userId) }).toString()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    const closeDialog = () => {
        visible.value = false
    }

    const deleteFile = async () => {
        try {
            await useApi().delete(`configs/files/${props.filename}?${qeuryString}`)

            toast.add({ severity: 'success', summary: 'Success', detail: `File ${props.filename} deleted successfully.`, life: 4000 })
            emits('deleted')
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to delete file ${props.filename}.`, life: 4000 })
        } finally {
            closeDialog()
        }
    }
</script>