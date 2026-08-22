import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { AuthService } from '@/services/AuthService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView,
      meta: { requiresAuth: true } // Anyone logged in can access Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/auth/ResetPasswordView.vue'),
    },
    {
      path: '/config-editor',
      name: 'config-editor',
      component: () => import('../views/config/ConfigEditorView.vue'),
      meta: { 
        requiresAuth: true, 
        requiredPermission: 'manager' //Permission.CONFIG_MANAGE // Locked to Config Editors / Admins
      }
    },
    {
      path: '/config-files',
      name: 'config-files',
      component: () => import('../views/config/ConfigFilesView.vue'),
      meta: { 
        requiresAuth: true, 
        requiredPermission: 'manager' // Locked to Config Editors / Admins
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/user/SettingsView.vue'),
      meta: { requiresAuth: true } // Profile / Settings open to logged-in users
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/user/UsersView.vue'),
      meta: { 
        requiresAuth: true,
        requiredPermission: 'admin'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    }
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const isAuthenticated = AuthService.isAuthenticated()

  const isAuthRoute = ['login', 'register', 'forgot-password', 'reset-password'].includes(to.name as string)

  // 1. Session Cleanup if token expired / invalid
  if (!isAuthenticated) {
    authStore.setAuthenticated(false)
    userStore.setUser(null)
    // AuthService.sessionExpired()
  }

  // 2. Redirect logged-in users away from Auth pages (Login, Register, etc.)
  if (isAuthenticated && isAuthRoute) {
    return { name: 'home' }
  }

  // 3. Unauthenticated user accessing protected route -> Login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 4. Permission Check: Prevent restricted access and avoid infinite loops
  if (to.meta.requiredPermission && isAuthenticated) {
    const required = to.meta.requiredPermission as string
    const hasAccess = userStore.hasPermissions(required) || userStore.hasPermissions('admin') // Admins have access to all routes

    if (!hasAccess) {
      // If user is already heading home, allow it to prevent infinite loops
      if (to.name === 'home') return true
      
      // Redirect unauthorized user back to Home View
      return { name: 'home' }
    }
  }

  return true
})

export default router