<template>
    <div class="flex justify-content-center">
        <Button type="button" severity="secondary" variant="outlined" iconOnly aria-label="Apps" @click="toggle">
            <Bars />
        </Button>
        <Menu ref="menu" :model="items" popup class="">
            <template #start>
                <span class="flex align-items-center gap-1 pl-3 py-2">
                    <User :size="30" />
                    <span class="text-lg font-semibold">User Profile</span>
                </span>
            </template>
            <template #submenulabel="{ item }">
                <span class="text-primary font-bold text-sm">{{ item.label }}</span>
            </template>
            <template #item="{ item, icon, label, props }">
                <a v-ripple class="flex align-items-center pl-2 py-1 cursor-pointer" :class="item.linkClass" v-bind="props.action">
                    <component :is="icon" />
                    <span class="ms-2 text-sm">{{ label }}</span>
                    <Badge v-if="item.badge" class="ms-auto" :value="item.badge" />
                    <span v-if="item.shortcut" class="ms-auto border border-surface rounded-sm bg-emphasis text-muted-color text-xs px-1 py-0.5">{{ item.shortcut }}</span>
                </a>
            </template>
            <template #end>
                <button v-ripple class="relative overflow-hidden w-full border-none bg-transparent flex align-items-start py-2 pl-3 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                    <Avatar :label="avatarLabel" class="mr-2" shape="circle" />
                    <span class="flex flex-column align-items-start gap-1">
                        <span class="text-sm font-bold">{{ userFullName || userUsername }}</span>
                        <span class="text-xs">Admin</span>
                    </span>
                </button>
            </template>
        </Menu>
    </div>
</template>

<script setup>
    import { ref, computed } from "vue"
    import { useRouter } from 'vue-router'
    import { useUserStore } from "@/stores/userStore"
    import { useAuthStore } from "@/stores/authStore"
    import { AuthService } from "@/services/AuthService"
    import { Auth } from "@/utils/auth"
    import { useToast } from 'primevue/usetoast'
    import { useApi } from "@/composables/useApi"
    import Cog from '@primeicons/vue/cog'
    import Inbox from '@primeicons/vue/inbox'
    import Plus from '@primeicons/vue/plus'
    import Search from '@primeicons/vue/search'
    import SignOut from '@primeicons/vue/sign-out'

    const router = useRouter()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const toast = useToast()

    const userUsername = computed(() => userStore.user.username ? userStore.user.username : null)
    const avatarLabel = computed(() => userUsername.value.slice(0, 2).toLocaleUpperCase())
    const userFullName = computed(() => userStore.user.firstName ? `${userStore.user.firstName} ${userStore.user.lastName}` : null)

    const { error, execute } = useApi()
    const menu = ref()
    const items = ref([
        {
            separator: true
        },
        {
            label: 'Documents',
            items: [
                {
                    label: 'New',
                    icon: Plus,
                },
                {
                    label: 'Search',
                    icon: Search,
                }
            ]
        },
        {
            label: 'Profile',
            items: [
                {
                    label: 'Settings',
                    icon: Cog,
                },
                {
                    label: 'Messages',
                    icon: Inbox,
                    badge: 2
                },
                {
                    label: 'Logout',
                    icon: SignOut,
                    linkClass: 'text-red-500 dark:text-red-400',
                    command: () => handleLogout()
                }
            ]
        },
        {
            separator: true
        }
    ])

    const toggle = (event) => {
        menu.value.toggle(event)
    }

    const handleLogout = async () => {
        try {
            await execute(() => AuthService.logout(Auth.getRefreshToken())) // Execute login with nessery header and Bearer token
            
            authStore.setAuthenticated(false)
            userStore.setUser(null)

            toast.add({ severity: 'success', summary: 'Sign out Successful!', detail: 'You have successfull sign out.', life: 5000 })
            router.push({ name: 'login' })
            return
        } catch(err) {
            toast.add({ severity: 'error', summary: 'Sign out Failed', detail: error.value, life: 5000 })
            return
        }
    }
</script>