import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/RegistrationView.vue')
    },
    {
      path: '/profile_settings',
      name: 'profile_settings',
      component: () => import('../views/UserProfileView.vue')
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/UserEventsView.vue')
    },
    {
      path: '/event/:key',
      name: 'event',
      component: () => import('../views/EventView.vue')
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('../views/UserLocationsView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
