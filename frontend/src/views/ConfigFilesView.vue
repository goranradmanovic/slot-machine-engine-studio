<template>
    <Panel>
        <template #header>
            <h2 class="text-2xl font-bold">Config Files Table</h2>
        </template>

        <DataTable
            v-model:filters="filters"
            :value="files"
            :loading="loading"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="name"
            filterDisplay="row"
            :globalFilterFields="globalFilterFields"
            stripedRows
            tableStyle="min-width: 50rem"
            class="files_table"
            removableSort
        >
            <template #header>
                <div class="flex gap-2 align-items-center justify-content-between w-full pb-4">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <Search />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" type="text" placeholder="Keyword Search" />
                    </IconField>

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
            <template #empty>No Config files found.</template>

            <Column field="name" header="Name" sortable />
            <Column field="path" header="File Path" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <FolderOpen color="gold" />
                    <span class="files_path" :title="slotProps.data.path">{{ slotProps.data.path }}</span>
                </div>
            </Column>
            <Column field="extension" header="Extension" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <File color="lime" />
                    {{ slotProps.data.extension }}
                </div>
            </Column>
            <Column field="sizeInBytes" header="Size" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <Database color="khaki" />
                    {{ formatSize(slotProps.data.sizeInBytes) }}
                </div>
            </Column>
            <Column field="isFile" header="Is File" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <File color="lime" />
                    {{ slotProps.data.isFile ? 'Yes' : 'No' }}
                </div>
            </Column>
            <Column field="isDirectory" header="Is Directory" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <Folder color="gold" />
                    {{ slotProps.data.isDirectory ? 'Yes' : 'No' }}
                </div>
            </Column>
            <Column field="createdAt" header="Created At" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <FilePlus color="green" />
                    {{ formatDate(slotProps.data.createdAt) }}
                </div>
            </Column>
            <Column field="updatedAt" header="Updated At" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <FileEdit color="orange" />
                    {{ formatDate(slotProps.data.updatedAt) }}
                </div>
            </Column>
            <Column field="lastAccessedAt" header="Last Accessed At" #body="slotProps" sortable>
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
                    <Button severity="contrast" icon="pi pi-download" @click="downloadFile(slotProps.data.name)">
                        <Spinner v-if="downloadingFile === slotProps.data.name && loading" class="spinner" />
                    </Button>
                </div>
            </Column>
        </DataTable>
    </Panel>

    <ViewEditDialog v-model:visible="editDialog.visible" :filename="editDialog.filename" :is-edit="editDialog.edit" />
    <DeleteFileDialog v-model:visible="deleteDialog.visible" :filename="deleteDialog.filename" @deleted="handleDeleteConfigFile" />
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { FilterMatchMode } from '@primevue/core/api'
    import { defaultConfig } from '@/utils/default-config.ts'
    import { useApi } from '@/composables/useApi'
    import { useUserStore } from '@/stores/userStore'
    import { useToast } from 'primevue/usetoast'
    import ViewEditDialog from '@/components/dialogs/ViewEditDialog.vue'
    import DeleteFileDialog from '@/components/dialogs/DeleteFileDialog.vue'

    const { loading, error, post, get } = useApi()
    const toast = useToast()
    const userStore = useUserStore()

    const userId = userStore.getUser?.id
    const qeuryString = new URLSearchParams({ id: String(userId) }).toString()

    const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        path: { value: null, matchMode: FilterMatchMode.CONTAINS },
        extension: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sizeInBytes: { value: null, matchMode: FilterMatchMode.EQUALS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
        updatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lastAccessedAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const globalFilterFields = ref<string[]>(['name', 'path', 'extension', 'sizeInBytes', 'createdAt', 'updatedAt', 'lastAccessdAt'])

    const editDialog = ref<{}>({
        visible: false,
        filename: '',
        edit: false
    })

    const deleteDialog = ref<{}>({
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

    const downloadingFile = ref<string | null>(null)
    const configFiles = ref<{}[]>([])

    const files = computed(() => configFiles.value ?? [])
    const totalFiles = computed(() => configFiles.value ? configFiles.value.length : 0)
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

    // Get initial all files from config folder
    const getConfigFiles = async () => {
        try {
            configFiles.value = await get(`configs/files?${qeuryString}`)
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
            await post('configs/files', { id: userId, data:defaultConfig })

            if (error.value) throw new Error('Server rejected creating new config')
            await getConfigFiles()
            toast.add({ severity: 'success', summary: 'Saved', detail: 'Configuration created successfully', life: 8000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Creation Failed', detail: (err as Error).message, life: 8000 })
        }
    }

    // Delete config file
    const handleDeleteConfigFile = () => {
        // Remove the deleted file from the configData array localy so that the table updates without needing to refetch the data from the server
        configFiles.value = configFiles.value.filter(file => file.name !== deleteDialog.value.filename)
    }

    // Download config file
    const downloadFile = async (filename: string) => {
        try {
            // Prevent multiple clicks on the same/other buttons while downloading
            if (downloadingFile.value) return

            downloadingFile.value = filename

            const response = await get(`configs/files/download/${filename}?${qeuryString}`)
            
            if (error.value) throw new Error('Could not download config file')

            // Convert payload stream directly to a blob object
            const jsonString = JSON.stringify(response, null, 2)
            const blob = new Blob([jsonString], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)

            link.click()

            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
    
            toast.add({ severity: 'success', summary: 'Success', detail: 'Config file downloaded.', life: 4000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to download config file.', life: 4000 })
            throw err // Re-throw so form handler captures the failure state
        } finally {
            // Reset state to remove the spinner once finished or failed
            downloadingFile.value = null;
        }
    }

    onMounted(async () => {
        await getConfigFiles()
    })
</script>