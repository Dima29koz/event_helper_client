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
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/RegistrationView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/profile_settings',
      name: 'profile_settings',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('../views/UserEventsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/event/:key',
      name: 'event',
      component: () => import('../views/EventView.vue')
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('../views/UserLocationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/confirm_email',
      name: 'confirm_email',
      component: () => import('../views/ConfirmEmailView.vue')
    },
    {
      path: '/reset_password',
      name: 'reset_password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

export default router
