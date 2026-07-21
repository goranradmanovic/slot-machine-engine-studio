import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserDto } from '@/dto/users/UserDto'

export const useUserStore = defineStore('user', () => {
    const user = ref<UserDto | null>(null)

    const getUser = computed(() => user.value)

    const setUser = (val: UserDto) => user.value = val

    return { user, getUser, setUser }
}, { persist: true })