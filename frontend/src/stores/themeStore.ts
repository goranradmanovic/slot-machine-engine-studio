import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // Single source of truth
  const theme = ref<Theme>('light')

  // Reactive computed helper for booleans (e.g. v-model on toggles)
  const isDarkTheme = computed(() => theme.value === 'dark')

  // Helper to apply HTML class and sync with localStorage
  const applyTheme = (newTheme: Theme) => {
    theme.value = newTheme

    if (newTheme === 'dark') {
      document.documentElement.classList.add('p-dark')
    } else {
      document.documentElement.classList.remove('p-dark')
    }
    
    localStorage.setItem('theme', newTheme)
  }

  const toggleDarkMode = () => {
    applyTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (val: Theme) => {
    applyTheme(val)
  }

  // Restore saved theme on initial page load
  const initTheme = () => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
    } else {
      // Optional: check system preferred color scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  }

  // Initialize theme on store creation
  initTheme()

  return {
    theme,
    isDarkTheme,
    toggleDarkMode,
    setTheme,
    initTheme
  }
})