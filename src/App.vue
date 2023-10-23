<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/NavbarHeader.vue'
import { useCurrentUserStore } from './stores/currentUserStore'

export default {
  components: {
    Navbar
  },

  async mounted() {
    const currentUserStore = useCurrentUserStore()
    if (this.$cookies.keys().includes('csrf_access_token')) {
      await currentUserStore.fetch_user()
    }
    this.$router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!currentUserStore.isAuth) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          next()
        }
      } else {
        next()
      }
    })

    this.$router.afterEach((to) => {
      if (to.matched.some((record) => record.meta.requiresAuth === false)) {
        if (currentUserStore.isAuth) {
          this.$router.push({ name: 'profile_settings' })
        }
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
