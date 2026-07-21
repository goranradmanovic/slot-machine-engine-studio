<template>
    <Dialog v-model:visible="visible" modal :style="{ 'min-width': '55rem' }" :closable="false" :header="dialogHeaderText">
        <div class="flex items-center justify-content-center">
            <div class="raw-json-editor w-full">
                <JsonEditorVue v-model="data" :mode="'text'" :main-menu-bar="true" :readOnly="!props.isEdit"/>
            </div>
        </div>
        <template #footer>
            <div class="flex gap-2 mt-4">
                <Button text severity="secondary" @click="closeDialog">Cancel</Button>
                <Button
                    v-if="isEdit"
                    @click="editConfig()"
                    :disabled="loading"
                    :loading="loading"
                    icon="pi pi-save" 
                    label="Save" 
                    severity="success"
                    variant="outlined" 
                />
            </div>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
    import { ref, watch, toRaw, computed } from "vue"
    import { useApi } from '@/composables/useApi'
    import { useToast } from 'primevue/usetoast'
    import { useUserStore } from "@/stores/userStore";
    import JsonEditorVue from 'json-editor-vue'

    const props = defineProps<{
        filename: string,
        isEdit: boolean
    }>()

    const emits = defineEmits<{
        (e: 'edited'): void
    }>()

    const { loading, get, patch } = useApi()
    const toast = useToast()
    const userStore = useUserStore()

    const userId = userStore.getUser?.id
    const qeuryString = new URLSearchParams({ id: String(userId) }).toString()

    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    const data = ref<{} | null>(null)

    watch(
        visible,
        async (open) => {
            if (!open) return
            data.value = await get(`configs/files/${props.filename}?${qeuryString}`)
        }
    )

    const dialogHeaderText = computed(() => `Quick ${props.isEdit ? 'Edit' : 'Preview'} of Config File`)

    const closeDialog = () => {
        visible.value = false
    }

    const editConfig = async () => {
        // Strip Vue proxies to ensure it doesn't lock up UI reactivity
        let payload = toRaw(data.value)

        // Handle string formats (from raw JSON editor) vs object formats cleanly
        if (typeof payload === 'string') {
            payload = JSON.parse(payload)
        } else {
            payload = structuredClone(payload)
        }

        try {
            await patch(`configs/files/${props.filename}`, { id: userId, data: payload })

            toast.add({ severity: 'success', summary: 'Success', detail: `File ${props.filename} edited successfully.`, life: 4000 })
            emits('edited')
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to edit file ${props.filename}.`, life: 4000 })
        } finally {
            closeDialog()
        }
    }
</script>