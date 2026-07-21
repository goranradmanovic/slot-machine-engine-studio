import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home', // Resolves both '/' and '/home' to HomeView!
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      alias: '/login',
      // lazy-loaded when the route is visited.
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      alias: '/register',
      // lazy-loaded when the route is visited.
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      alias: '/forgot-password',
      // lazy-loaded when the route is visited.
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      alias: '/reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
    },
    {
      path: '/config-editor',
      name: 'config-editor',
      alias: '/config-editor',
      // lazy-loaded when the route is visited.
      component: () => import('../views/ConfigEditorView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/config-files',
      name: 'config-files',
      alias: '/config-files',
      // lazy-loaded when the route is visited.
      component: () => import('../views/ConfigFilesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/' // Or point to a 404 view component
    }
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // 1. Authenticated user trying to access Login / Auth routes -> Send to Home
  if (isAuthenticated && (to.name === 'login' || to.name === 'register' || to.name === 'forgot-password' || to.name === 'reset-password')) {
    return { name: 'home' }
  }

  // 2. Unauthenticated user trying to access Protected routes -> Send to Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. Allow all other routes
  return true
})

export default router