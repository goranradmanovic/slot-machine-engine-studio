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
                    @click="toggleDarkMode" 
                    :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"  
                    aria-label="Toggle Dark Mode"  
                    variant="text" 
                />
            </div>
        </template>
    </Menubar>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { RouterLink } from 'vue-router'
    import { useSlotConfigStore } from '@/stores/slotConfigStore'
    import { useAuthStore } from '@/stores/authStore.ts'
    import { useGameStore } from '@/stores/gameStore'
    import { useRoute } from 'vue-router'
    import ProfileMenu from './ProfileMenu.vue'

    const route = useRoute()
    const gameStore = useGameStore()
    const slotConfigStore = useSlotConfigStore()
    const authStore = useAuthStore()

    const isDark = ref(false)

    const isHomeRoute = computed(() => route.name === 'home')

    // Dynamic Menu Items Computed Property
    const menuItems = computed(() => {
        // Common items visible to everyone (optional)
        const items = []

        if (authStore.isAuthenticated) {
            // Links ONLY for Registered/Logged-in Users
            items.push(
                { label: 'Live Preview', icon: 'pi pi-play', route: '/' },
                { label: 'Config Editor', icon: 'pi pi-cog', route: '/config-editor' },
                { label: 'Config Files', icon: 'pi pi-table', route: '/config-files' }
            )
        }

        return items
    })

    const toggleDarkMode = () => {
        isDark.value = !isDark.value

        if (isDark.value) {
            document.documentElement.classList.add('p-dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('p-dark')
            localStorage.setItem('theme', 'light')
        }
    }

    const startGame = () => {
        gameStore.gameFrameRef.value?.contentWindow?.postMessage({ type: 'START_GAME' }, '*')
    }

    const savedTheme = () => {
        // Check for saved theme in localStorage on load
        if (localStorage.getItem('theme') === 'dark') {
            isDark.value = true;
            document.documentElement.classList.add('p-dark');
        }
    }

    onMounted(() => {
        savedTheme()
    })
</script>