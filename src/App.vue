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
import { profileSettings } from '@/utils/api_user_account'
import { useCurrentUserStore } from './stores/currentUserStore'

export default {
  components: {
    Navbar
  },

  mounted() {
    if (this.$cookies.keys().includes('csrf_access_token')) {
      this.getUserData()
    }
  },

  methods: {
    async getUserData() {
      let user_data = await profileSettings()
      const currentUserStore = useCurrentUserStore()
      currentUserStore.setData(user_data)
    }
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
