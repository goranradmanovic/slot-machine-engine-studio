import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/config-editor',
      name: 'config-editor',
      // lazy-loaded when the route is visited.
      component: () => import('../views/ConfigEditorView.vue'),
    },
    {
      path: '/config-files',
      name: 'config-files',
      // lazy-loaded when the route is visited.
      component: () => import('../views/ConfigFilesView.vue'),
    }
  ],
})

export default router
