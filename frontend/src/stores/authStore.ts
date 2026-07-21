import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const authenticated = ref<boolean>(false)

    const isAuthenticated = computed(() => authenticated.value)

    const setAuthenticated = (val: boolean) => authenticated.value = val

    return { authenticated, isAuthenticated, setAuthenticated }
}, { persist: true })