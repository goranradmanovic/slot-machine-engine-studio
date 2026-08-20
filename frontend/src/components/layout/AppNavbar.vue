<template>
    <Menubar :model="menuItems" class="w-full" :pt="{ rootList: 'mx-auto' }">
        <template #start>
            <div class="flex align-items-center gap-3">
                <i class="pi pi-cog text-xl text-primary" />
                <h1 class="text-xl font-bold">SM Engine Studio</h1>
                <Tag v-if="authStore.isAuthenticated" severity="success" :value="`Active Config: ${slotConfigStore.currentConfigFile}`" />
            </div>
        </template>

        <template #item="{ item, props }">
            <Button v-if="item.route" asChild v-slot="slotProps" variant="link">
                <RouterLink :to="item.route" :class="slotProps.class">
                    <i :class="item.icon" />
                    {{ item.label }}
                </RouterLink>
            </Button>
        </template>

        <template #end>
            <div class="flex items-center gap-2">
                <template v-if="!authStore.isAuthenticated">
                    <Button asChild v-slot="slotProps" variant="link">
                        <RouterLink to="/register" :class="slotProps.class">
                            <i class="pi pi-user-plus" />
                            Sign up
                        </RouterLink>
                    </Button>
                    <Button asChild v-slot="slotProps" variant="link">
                        <RouterLink to="/login" :class="slotProps.class">
                            <i class="pi pi-sign-in" />
                            Sign in
                        </RouterLink>
                    </Button>
                </template>
                <template v-else>
                    <Button v-if="isHomeRoute" @click="startGame" icon="pi pi-play" label="Simulate Spins" severity="warn" size="small" />
                    <ProfileMenu class="ml-2" />
                </template>

                <Button
                    @click="themeStore.toggleDarkMode" 
                    :icon="themeStore.isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"  
                    aria-label="Toggle Dark Mode"  
                    variant="text" 
                />
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { RouterLink } from 'vue-router'
    import { useSlotConfigStore } from '@/stores/slotConfigStore'
    import { useAuthStore } from '@/stores/authStore.ts'
    import { useUserStore } from '@/stores/userStore.ts'
    import { useGameStore } from '@/stores/gameStore'
    import { useThemeStore } from '@/stores/themeStore.ts'
    import { useRoute } from 'vue-router'
    import ProfileMenu from './ProfileMenu.vue'

    const route = useRoute()
    const gameStore = useGameStore()
    const themeStore = useThemeStore()
    const slotConfigStore = useSlotConfigStore()
    const authStore = useAuthStore()
    const userStore = useUserStore()

    const isHomeRoute = computed(() => route.name === 'home')

    // Dynamic Menu Items Computed Property
    const menuItems = computed(() => {
        if (!authStore.isAuthenticated) return []

        const items = []

        // 1. Live Preview / Home — visible if user has 'basic' OR is Admin
        if (userStore.hasPermissions('basic') || userStore.hasPermissions('manager') || userStore.hasPermissions('admin')) {
            items.push({ label: 'Live Preview', icon: 'pi pi-play', route: '/' })
        }

        // 2. Config Links — visible if user has 'config.manage' OR is Admin
        if (userStore.hasPermissions('manager') || userStore.hasPermissions('admin')) {
            items.push(
                { label: 'Config Editor', icon: 'pi pi-cog', route: '/config-editor' },
                { label: 'Config Files', icon: 'pi pi-table', route: '/config-files' }
            )
        }

        if (userStore.hasPermissions('admin')) {
            items.push(
                { label: 'Users', icon: 'pi pi-users', route: '/users' }
            )
        }

        return items
    })

    const startGame = () => {
        gameStore.gameFrameRef.value?.contentWindow?.postMessage({ type: 'START_GAME' }, '*')
    }
</script>