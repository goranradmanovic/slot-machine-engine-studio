<template>
    <Dialog v-model:visible="visible" modal :closable="false" header="Delete user" :style="{ width: '26rem' }">
        <div class="flex flex-column gap-4">
            <p class="text-surface-500 dark:text-surface-400 text-sm mt-0 mb-0">This action cannot be undone. All of user data, including config file, and settings will be permanently removed.</p>
            <div class="flex justify-content-end gap-2">
                <Button severity="secondary" @click="closeDialog">Cancel</Button>
                <Button severity="danger" @click="deleteUser">
                    <Spinner v-if="loading" spin />
                    Delete
                </Button>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
    import { useApi } from '@/composables/useApi'
    import { useToast } from 'primevue/usetoast'
    
    const props = defineProps<{
        user: {}
    }>()

    const emits = defineEmits<{
        (e: 'deleted', userId: number): void
    }>()

    const { loading } = useApi()
    const toast = useToast()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    const closeDialog = () => {
        visible.value = false
    }

    const deleteUser = async () => {
        try {
            await useApi().delete(`users/${props.user.id}`)

            toast.add({ severity: 'success', summary: 'Success', detail: `User "@${props.user?.username}" deleted successfully.`, life: 4000 })
            emits('deleted', props.user.id)
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to delete user with "@${props.user?.username}".`, life: 4000 })
        } finally {
            closeDialog()
        }
    }
</script>