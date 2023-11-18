<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <RouterView />
      <div class="notificationContainer">
        <v-slide-y-transition group>
          <v-alert
            v-for="notification in notificationsStore.notifications"
            :key="notification[0]"
            :type="notification[1].type"
            :text="notification[1].text"
            closable
            @click:close="notificationsStore.removeNotification(notification[0])"
          >
          </v-alert>
        </v-slide-y-transition>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/NavbarHeader.vue'
import { useCurrentUserStore } from './stores/currentUserStore'
import { useNotificationsStore } from './stores/notificationsStore'

export default {
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },

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

<style scoped>
.notificationContainer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: grid;
  grid-gap: 0.5em;
  z-index: 9999;
}
</style>
