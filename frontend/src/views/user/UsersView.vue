<template>
    <Panel>
        <template #header>
            <h2 class="text-2xl font-bold">Users Table</h2>
        </template>

        <DataTable
            v-model:filters="filters"
            :value="allUsers"
            :loading="loading"
            paginator
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
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
                        @click="openEditDialog({}, false)"
                        :loading="loading" 
                        severity="success" 
                    >
                        <Plus />
                        Create New User
                    </Button>
                </div>
            </template>
            <template #empty>No users found.</template>


            <Column field="id" header="# ID" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <Hashtag color="gold" />
                    <span class="files_path" :title="slotProps.data.path">{{ slotProps.data.id }}</span>
                </div>
            </Column>
            <Column field="username" header="Username" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    @{{ slotProps.data.username }}
                </div>
            </Column>
            <Column field="firstName" header="First Name" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    {{ slotProps.data.firstName ? slotProps.data.firstName : 'N/A' }}
                </div>
            </Column>
            <Column field="lastName" header="Last Name" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    {{ slotProps.data.lastName ? slotProps.data.lastName : 'N/A' }}
                </div>
            </Column>
            <Column field="email" header="Email" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1">
                    <Envelope color="orange" />
                    {{ slotProps.data.email }}
                </div>
            </Column>
            <Column field="permissions" header="Permission" #body="slotProps" sortable>
                <div class="flex align-items-center gap-1 capitalize">
                    <Shield color="gray" />
                    {{ parseJsonArray(slotProps.data.permissions)[0] }}
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
            <Column field="actions" header="Actions" #body="slotProps">
                <div class="flex gap-3">
                    <Button severity="warn" @click="openEditDialog(slotProps.data, true)" class="py-2">
                        <Pencil />
                    </Button>
                    <Button severity="danger" @click="openDeleteDialog(slotProps.data)" class="py-2">
                        <Trash />
                    </Button>
                </div>
            </Column>

            <template #footer>
                <h2 class="text-sm font-bold text-right">Total Users: {{ totalUsers }}</h2>
            </template>
        </DataTable>
    </Panel>

    <CreateEditUserDialog v-model:visible="editDialog.visible" :is-edit="editDialog.edit" :user="editDialog.user" @created="handleCreateUser" @edited="handleEditUser" />
    <DeleteUserDialog v-model:visible="deleteDialog.visible" :user="deleteDialog.user" @deleted="handleDeleteUser" />
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { FilterMatchMode } from '@primevue/core/api'
    import { parseJsonArray } from '@/utils/parseJsonArray'
    import { useApi } from '@/composables/useApi'
    import { useToast } from 'primevue/usetoast'
    import CreateEditUserDialog from '@/components/dialogs/users/CreateEditUserDialog.vue'
    import DeleteUserDialog from '@/components/dialogs/users/DeleteUserDialog.vue'

    const { loading, error, get } = useApi()
    const toast = useToast()

    const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        username: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        permissions: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })

    const globalFilterFields = ref<string[]>(['id', 'username', 'firstName', 'lastName', 'email', 'permissions','createdAt'])

    const editDialog = ref<{}>({
        visible: false,
        user: {},
        edit: false
    })

    const deleteDialog = ref<{}>({
        visible: false,
        user: {}
    })

    const openEditDialog = (user: {}, edit = false) => {
        editDialog.value = {
            visible: true,
            user,
            edit
        }
    }

    const openDeleteDialog = (user: {}) => {
        deleteDialog.value = {
            visible: true,
            user
        }
    }

    const users = ref<{}[]>([])
    const allUsers = computed(() => users.value ?? [])
    const totalUsers = computed(() => users.value?.length ?? 0)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }

    // Get initial all files from config folder
    const getAllUsers = async () => {
        try {
            let response = await get('users/all')
            users.value = response?.data

            if (error.value) throw new Error('Could not get all users.')
            toast.add({ severity: 'success', summary: 'Success', detail: 'Users loaded.', life: 4000 })
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users.', life: 4000 })
            throw err // Re-throw so form handler captures the failure state
        }
    }

    // Create user
    const handleCreateUser = (user: {}) => {
        console.log('User created:', user)
        // Add the new user to the users array locally so that the table updates without needing to refetch the data from the server
        users.value = [...users.value, user]
    }

    // Edit user
    const handleEditUser = (user: {}) => {
        console.log('User edited:', user)
        // Update the edited user in the users array locally so that the table updates without needing to refetch the data from the server
        users.value = users.value.map(u => u?.id === user?.id ? user : u)
    }

    // Delete user
    const handleDeleteUser = (userId: number) => {
        // Remove the deleted user from the users array locally so that the table updates without needing to refetch the data from the server
        users.value = users.value.filter(u => u?.id !== userId)
    }

    onMounted(async () => {
        await getAllUsers()
    })
</script>