<template>
  <div>
    <LoginForm @login="loginUser"></LoginForm>
  </div>
</template>

<script>
import LoginForm from '@/components/Forms/LoginForm.vue'
import { login, profileSettings } from '@/utils/api_user_account'

import { useCurrentUserStore } from '../stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },
  components: {
    LoginForm
  },
  methods: {
    async loginUser(user) {
      await login(user.username, user.password)

      this.currentUserStore.authenticate()
      this.getUserData()
      this.$router.push({ name: 'events' })
    },
    async getUserData() {
      let user_data = await profileSettings()
      this.currentUserStore.setData(user_data)
    }
  }
}
</script>

<style scoped></style>
