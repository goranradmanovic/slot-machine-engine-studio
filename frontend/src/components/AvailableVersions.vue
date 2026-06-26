<template>
    <Card class="w-22rem">
        <template #title>Available Config Versions</template>
        <template #subtitle>Below is a list of available slot configurations. Select one to apply.</template>
        <template #content>
            <Form 
                v-slot="$form" 
                :initial-values="initialValues" 
                :resolver="resolver" 
                @submit="onFormSubmit" 
                class="flex flex-column w-full mt-4 gap-4 align-items-end version-form"
            >
                <Fieldset v-if="status" legend="Status" class="overflow-auto w-full p-2">
                    <Message :severity="status.severity">
                        <span class="text-sm">  
                            Current Config: {{ selectedVersion || 'Default' }} <br />
                            Status: {{ status?.summary || '' }}
                        </span>
                    </Message>
                </Fieldset>

                <div class="flex flex-column justify-content-center align-items-center gap-3 w-full">
                    <Select 
                        v-model="selectedVersion" 
                        :options="configData" 
                        placeholder="Select a version to edit" 
                        class="w-full sm:w-56" 
                    />
                    <Button 
                        type="submit" 
                        severity="secondary" 
                        :label="btnLabel" 
                        class="w-full sm:w-56" 
                        :disabled="!selectedVersion" 
                    />
                </div>
            </Form>
        </template>
    </Card>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
    import { useToast } from 'primevue/usetoast'
    import { useConfig } from '@/composables/useConfig'
    import { useSlotConfigStore } from '@/stores/slotConfigStore'
    import { type StatusVersion, type FormValues} from '@/types/AvailableVersions'
    
    const prop = defineProps({
        btnLabel: {
            type: String,
            required: false,
            default: 'Apply'
        }
    })

    const emit = defineEmits(['load-config'])

    const toast = useToast()
    const slotConfigStore = useSlotConfigStore()
    const { configData, fetchConfig } = useConfig()

    const selectedVersion = ref<string | null>(null)
    const status = ref<StatusVersion | null>(null)
    const initialValues = ref<FormValues>({ selectedVersion: '' })
    
    watch(selectedVersion, (newValue) => {
        if (newValue) {
            status.value = null
            slotConfigStore.slotConfigVersion = null
        }
    })

    // Form Validation Resolver
    const resolver = ({ values }: { values: Record<string, any> }) => {
        const errors: Record<string, any[]> = { selectedVersion: [] }

        if (!values.selectedVersion) {
            errors.selectedVersion.push({ type: 'required', message: 'Version is required.' })
        }

        return { values, errors }
    }

    // Form Submission Event
    const onFormSubmit = async ({ valid }: { valid: boolean }) => {
        if(valid) {
            slotConfigStore.slotConfigVersion = selectedVersion.value
            emit('load-config', selectedVersion.value)
            status.value = { severity: 'success', summary: 'Loaded Configuration Successfully' }
        } else {
            status.value = { severity: 'error', summary: 'Failed to Load Configuration' }
        }
    }

    onMounted(async () => {
        try {
            await fetchConfig()
            toast.add({ severity: 'success', summary: 'Success', detail: 'Config loaded.', life: 4000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch config versions.', life: 4000 })
        }
    })

    onBeforeUnmount(() => {
        slotConfigStore.setConfigVersion(null) // Clean up the reference
    })
</script>