<template>
  <Card class="w-full surface-50">
    <template #title>Account Preferences</template>
    <template #subtitle>
      <p class="mb-4 text-surface-500">
        Customize how the application looks and behaves to match your personal preferences.
      </p>
    </template>

    <template #content>
      <div class="flex flex-column gap-3">
        <div class="flex align-items-center justify-content-between">
          <label for="darkMode" class="cursor-pointer">Dark Mode</label>
          <ToggleSwitch v-model="darkMode" />
        </div>

        <div class="flex align-items-center justify-content-between">
          <label for="emailNotifications" class="cursor-pointer">Email Notifications</label>
          <ToggleSwitch v-model="emailNotifications" inputId="emailNotifications" />
        </div>

        <div class="flex align-items-center justify-content-between">
          <label for="desktopNotifications" class="cursor-pointer">Desktop Notifications</label>
          <ToggleSwitch v-model="desktopNotifications" inputId="desktopNotifications" />
        </div>
      </div>

      <div class="flex justify-content-end mt-4">
        <Button @click="savePreferences">Save Preferences</Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useToast } from 'primevue/usetoast'
    import { useThemeStore } from '@/stores/themeStore'

    const toast = useToast()
    const themeStore = useThemeStore()
    
    const darkMode = ref<boolean>(false)
    const emailNotifications = ref<boolean>(false)
    const desktopNotifications = ref<boolean>(false)

    const saveThemePreferences = () => {
        themeStore.setTheme(darkMode.value ? 'dark' : 'light')
    }

    const savePreferences = () => {
        saveThemePreferences()

        toast.add({
            severity: 'success',
            summary: 'Preferences Saved Successfully!',
            detail: 'Your account preferences are updated.',
            life: 4000
        })
    }

    onMounted(() => {
        darkMode.value = themeStore.isDarkTheme
    })
</script>