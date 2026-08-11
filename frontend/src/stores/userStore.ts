import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserDto } from '@/dto/users/UserDto'
import { AuthService } from '@/services/AuthService'
import { useApi } from '@/composables/useApi'

export const useUserStore = defineStore('user', () => {
    const { execute } = useApi()

    const user = ref<UserDto | null | unknown>(null)

    const getUser = computed(() => user.value)

    const hasPermissions = (permission: string) => {
        const userPermissions = (user.value as UserDto)?.permissions || []

        // Check for Full Admin access
        if (userPermissions.includes('admin.all')) {
            return true
        }

        // Otherwise check for the exact permission required
        return userPermissions.includes(permission)
    }

    const setUser = (val: UserDto | null | unknown) => user.value = val

    const fetchUserProfile = async (id: number) => {
        const response: unknown = await execute(() => AuthService.me(id))
        setUser(response)
    }

    return { user, getUser, setUser, fetchUserProfile, hasPermissions }
}, { persist: true })