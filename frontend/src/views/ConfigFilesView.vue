<template>
    <Panel>
        <template #header>
            <div class="flex gap-2 align-items-center justify-content-between w-full">
                <h2 class="text-2xl font-bold">Config Files Table</h2>
                <Button
                @click="createConfig()"
                :disabled="!newFile || loading"
                :loading="loading"
                icon="pi pi-plus" 
                label="Create New Config" 
                severity="success" 
                />
            </div>
        </template>

        <DataTable :value="files" :loading="loading" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" stripedRows tableStyle="min-width: 50rem" class="files_table">
            <Column field="name" header="Name"/>
            <Column field="path" header="File Path" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <FolderOpen color="gold" />
                    <span class="files_path">{{ formatPath(slotProps.data.path) }}</span>
                </div>
            </Column>
            <Column field="extension" header="Extension" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <File color="lime" />
                    {{ slotProps.data.extension }}
                </div>
            </Column>
            <Column field="sizeInBytes" header="Size" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <Database color="khaki" />
                    {{ formatSize(slotProps.data.sizeInBytes) }}
                </div>
            </Column>
            <Column field="isFile" header="Is File" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <File color="lime" />
                    {{ slotProps.data.isFile ? 'Yes' : 'No' }}
                </div>
            </Column>
            <Column field="isDirectory" header="Is Directory" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <Folder color="gold" />
                    {{ slotProps.data.isDirectory ? 'Yes' : 'No' }}
                </div>
            </Column>
            <Column field="createdAt" header="Created At" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <FilePlus color="green" />
                    {{ formatDate(slotProps.data.createdAt) }}
                </div>
            </Column>
            <Column field="updatedAt" header="Updated At" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <FileEdit color="orange" />
                    {{ formatDate(slotProps.data.updatedAt) }}
                </div>
            </Column>
            <Column field="lastAccessedAt" header="Last Accessed At" #body="slotProps">
                <div class="flex align-items-center gap-1">
                    <FileCheck color="steelblue" />
                    {{ formatDate(slotProps.data.lastAccessedAt) }}
                 </div>
            </Column>
            <Column field="actions" header="Actions" #body="slotProps">
                <div class="flex gap-3">
                    <Button icon="pi pi-eye" @click="openEditDialog(slotProps.data.name)" />
                    <Button severity="warn" icon="pi pi-pencil" @click="openEditDialog(slotProps.data.name, true)" />
                    <Button severity="danger" icon="pi pi-trash" @click="openDeleteDialog(slotProps.data.name)" />
                </div>
            </Column>
        </DataTable>
    </Panel>

    <ViewEditDialog v-model:visible="editDialog.visible" :filename="editDialog.filename" :is-edit="editDialog.edit" />
    <DeleteFileDialog v-model:visible="deleteDialog.visible" :filename="deleteDialog.filename" @deleted="deleteConfigFile" />
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { defaultConfig } from '@/utils/default-config.ts'
    import { useConfig } from '@/composables/useConfig'
    import { useToast } from 'primevue/usetoast'
    import ViewEditDialog from '@/components/dialogs/ViewEditDialog.vue'
    import DeleteFileDialog from '@/components/dialogs/DeleteFileDialog.vue'

    const { configData, loading, error, fetchConfig } = useConfig()
    const toast = useToast()

    const editDialog = ref({
        visible: false,
        filename: '',
        edit: false
    })

    const deleteDialog = ref({
        visible: false,
        filename: ''
    })

    const openEditDialog = (filename: string, edit = false) => {
        editDialog.value = {
            visible: true,
            filename,
            edit
        }
    }

    const openDeleteDialog = (filename: string) => {
        deleteDialog.value = {
            visible: true,
            filename
        }
    }

    const files = computed(() => configData.value ?? [])
    const totalFiles = computed(() => configData.value ? configData.value.length : 0)
    const newFile = computed(() => `reels_v${totalFiles.value + 1}.json`)

    const formatDate = (value?: string) => value ? Temporal.Instant.from(value).toLocaleString() : 'N/A'

    const formatSize = (sizeInBytes?: number) => {
        if (!sizeInBytes) return 'N/A'
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let size = sizeInBytes
        let unitIndex = 0

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`
    }

    const formatPath = (path: string) => {
        const parts = path.split('\\')
        return parts.length > 2 ? `.../${parts.slice(-2).join('/')}` : path
    }

    // Get initial all files from config folder
    const getConfigFiles = async () => {
        try {
            await fetchConfig('files')
            if (error.value) throw new Error('Could not find or read config files')
            toast.add({ severity: 'success', summary: 'Success', detail: 'Config Files Metadata loaded.', life: 4000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch config files.', life: 4000 })
            throw err // Re-throw so form handler captures the failure state
        }
    }

    // Create config file
    const createConfig = async () => {
        try {
            await fetchConfig('files', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(defaultConfig)
            })

            if (error.value) throw new Error('Server rejected creating new config')
            await getConfigFiles()
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Configuration created successfully', life: 8000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Creation Failed', detail: (err as Error).message, life: 8000 })
        }
    }

    // Delete config file
    const deleteConfigFile = () => {
        // Remove the deleted file from the configData array localy so that the table updates without needing to refetch the data from the server
        configData.value = configData.value.filter(file => file.name !== deleteDialog.value.filename)
    }

    onMounted(async () => {
        await getConfigFiles()
    })
</script>