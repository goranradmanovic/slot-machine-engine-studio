<template>
    <Dialog v-model:visible="visible" modal :style="{ 'min-width': '55rem' }" :closable="false" :header="dialogHeaderText">
        <div class="flex items-center justify-content-center">
            <div class="raw-json-editor w-full">
                <JsonEditorVue v-model="configData" :mode="'text'" :main-menu-bar="true" :readOnly="!props.isEdit"/>
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
    import { watch, toRaw, computed } from "vue"
    import { useConfig } from '@/composables/useConfig'
    import { useToast } from 'primevue/usetoast'
    import JsonEditorVue from 'json-editor-vue'

    const props = defineProps<{
        filename: string,
        isEdit: boolean
    }>()

    const emits = defineEmits<{
        (e: 'edited'): void
    }>()

    const { configData, loading, error, fetchConfig } = useConfig()
    const toast = useToast()
    const visible = defineModel<boolean>('visible', {
        type: Boolean,
        required: true,
        default: false
    })

    watch(
        visible,
        async (open) => {
            if (!open) return

            await fetchConfig(`files/${props.filename}`)
        }
    )

    const dialogHeaderText = computed(() => `Quick ${props.isEdit ? 'Edit' : 'Preview'} of Config File`)

    const closeDialog = () => {
        visible.value = false
    }

    const editConfig = async () => {
        // Strip Vue proxies to ensure it doesn't lock up UI reactivity
        let payload = toRaw(configData.value)

        // Handle string formats (from raw JSON editor) vs object formats cleanly
        if (typeof payload === 'string') {
            payload = JSON.parse(payload)
        } else {
            payload = structuredClone(payload)
        }

        await fetchConfig(`files/${props.filename}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (error.value) {
           return toast.add({ severity: 'error', summary: 'Error', detail: `Failed to edit file ${props.filename}.`, life: 4000 })
        }

        toast.add({ severity: 'success', summary: 'Success', detail: `File ${props.filename} edited successfully.`, life: 4000 })
        emits('edited')
        closeDialog()
    }
</script>