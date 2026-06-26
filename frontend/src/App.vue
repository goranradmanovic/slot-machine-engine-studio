<template>
  <Toast />

  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import AppHeader from '@/components/layout/AppHeader.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'
</script>