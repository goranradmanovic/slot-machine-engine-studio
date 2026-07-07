<template>
    <header class="flex justify-content-between align-items-center py-4">
        <div class="flex align-items-center gap-3">
            <i class="pi pi-cog text-xl text-primary" />
            <h1 class="text-xl font-bold">Slot Machine Engine Studio</h1>
            <Tag severity="success" :value="`Active Config: ${slotConfigStore.currentConfigFile}`" />
        </div>
        <nav class="flex gap-4">
            <Button asChild v-slot="slotProps" variant="link">
                <RouterLink to="/" :class="slotProps.class">Live Preview</RouterLink>
            </Button>
            <Button asChild v-slot="slotProps" variant="link">
                <RouterLink to="/config-editor" :class="slotProps.class">Config Editor</RouterLink>
            </Button>
            <Button asChild v-slot="slotProps" variant="link">
                <RouterLink to="/config-files" :class="slotProps.class">Config Files</RouterLink>
            </Button>
        </nav>
        <div class="flex gap-3">
            <Button v-if="isHomeRoute" @click="startGame" icon="pi pi-play" label="Simulate Spins" severity="warn" size="small" />
            <Button
                @click="toggleDarkMode" 
                :icon="isDark ? 'pi pi-moon' : 'pi pi-sun'"  
                aria-label="Toggle Dark Mode"  
                variant="text" 
            />
        </div>
    </header>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { RouterLink } from 'vue-router'
    import { useSlotConfigStore } from '@/stores/slotConfigStore'
    import { useGameStore } from '@/stores/gameStore'
    import { useRoute } from 'vue-router'

    const route = useRoute()
    const gameStore = useGameStore()
    const slotConfigStore = useSlotConfigStore()
    const isDark = ref(false)

    const isHomeRoute = computed(() => route.name === 'home')
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