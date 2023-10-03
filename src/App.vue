<template>
  <div>
    <Navbar></Navbar>
    <RouterView />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/js/dist/dropdown'
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/modal'

import Navbar from './components/NavbarHeader.vue'
import { useCurrentUserStore } from './stores/currentUserStore'

export default {
  components: {
    Navbar
  },

  mounted() {
    const currentUserStore = useCurrentUserStore()
    this.$router.beforeEach(async (to, from, next) => {
      if (this.$cookies.keys().includes('csrf_access_token')) {
        await currentUserStore.fetch_user()
      }
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
