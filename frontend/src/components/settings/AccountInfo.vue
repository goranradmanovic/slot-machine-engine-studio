<template>
  <div class="flex justify-content-center align-items-center">
      <ProgressSpinner v-if="!user" aria-label="loading" />
  </div>

  <Card v-if="user" class="w-full surface-50">
    <template #title>Account Info</template>
    <template #subtitle>
      <p class="mb-4 text-surface-500">Account personal information.</p>
    </template>

    <template #content>
      <div class="flex gap-3 align-items-center justify-items-center mb-3">
        <Avatar
          :label="user.username.charAt(0).toUpperCase()"  
          size="large" 
          shape="circle" 
        />
        <div class="flex flex-column gap-1 align-items-center justify-items-center">
          <div class="flex gap-2 justify-content-between w-full"> 
            <span class="text-primary text-base">@{{ user.username }}</span> - 
            <Tag :value="`ID: #${user.id}`" severity="primary" rounded />
          </div>
          <span class="text-color-secondary">
            {{ fullName ? fullName : 'No Name Provided' }}
          </span>
        </div>
      </div>

      <div class="flex flex-column gap-3">
        <!-- Email Detail -->
        <div class="flex gap-3 align-items-center justify-items-center">
          <Envelope size="18"/>
          <div class="flex flex-column">
            <span class="uppercase text-xs text-color-secondary font-medium">Email Address</span>
            <a :href="`mailto:${user.email}`" class="text-primary">{{ user.email }}</a>
          </div>
        </div>

        <!-- Created Date Detail -->
        <div class="flex gap-3 align-items-center justify-items-center">
          <CalendarClock size="18" />
          <div class="flex flex-column">
            <span class="uppercase text-xs text-color-secondary font-medium">Account Created</span>
            <span class="text-color-secondary font-medium">{{ formattedDate }}</span>
          </div>
        </div>

        <Divider />

        <!-- Permissions Section -->
        <div class="flex gap-2 flex-column mb-3">
          <span class="uppercase text-xs text-color-secondary font-medium">Assigned Permissions</span>
          <div class="flex gap-2">
            <Tag 
              v-for="perm in parsedPermissions" 
              :key="perm" 
              :value="perm" 
              :severity="getPermissionSeverity(perm)"
              icon="pi pi-shield"
            />
            <span v-if="parsedPermissions.length === 0" class="text-color-secondary font-italic text-sm">
              No permissions assigned
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-content-end">
        <Button label="Edit Profile" icon="pi pi-user-edit" severity="secondary" outlined @click="emits('edit-account')" />
        <Button label="Manage Access" icon="pi pi-key" severity="primary" @click="emits('edit-security')" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted } from 'vue'
    import type { UserDto } from '@/dto/users/UserDto'
    import { useUserStore } from '@/stores/userStore'

    const emits = defineEmits<{
      (e: 'edit-account'): void,
      (e: 'edit-security'): void
    }>()

    const userStore = useUserStore()

    const userId = Number(userStore.getUser?.id)
    const user = ref<UserDto | null>(null)
    
    watch(() => userStore.user, newVal => user.value = newVal)
    
    // Helper to format full name or provide fallback
    const fullName = computed(() => {
      if (user.value?.firstName || user.value?.lastName) {
        return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
      }
      return null
    })

    // Helper to safely parse stringified permissions array
    const parsedPermissions = computed(() => {
      if (user.value?.permissions.length === 0) return []

      try {
        return typeof user.value?.permissions === 'string' 
          ? JSON.parse(user.value.permissions) 
          : user.value?.permissions
      } catch (e) {
        console.error("Failed to parse permissions string", e)
        return []
      }
    })

    // Helper to format creation timestamp
    const formattedDate = computed(() => {
      if (!user.value?.createdAt) return 'N/A'

      return new Date(user.value?.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
      })
    })

    // Assign visual severity (colors) based on permission scope
    const getPermissionSeverity = (perm) => {
      if (perm.includes('write') || perm.includes('delete') || perm.includes('admin')) {
        return 'warn'
      }
      return 'info'
    }

    onMounted(async () => {
      await userStore.fetchUserProfile(userId)
      user.value = userStore.user
    })
</script>