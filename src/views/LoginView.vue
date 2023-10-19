<template>
  <LoginForm @login="loginUser" :error="error" :msg="msg"></LoginForm>
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
  data() {
    return {
      error: null,
      msg: 'msg' in this.$route.query ? this.$route.query.msg : ''
    }
  },
  methods: {
    async loginUser(user) {
      const res = await login(user.username, user.password)
      if ('msg' in res && res.msg == 'Wrong username or password') {
        this.error = 'Неверный логин или пароль'
        return
      }

      this.currentUserStore.authenticate()
      this.getUserData()
      if (this.$route.query.redirect) {
        this.$router.push({ path: this.$route.query.redirect })
      } else {
        this.$router.push({ name: 'events' })
      }
    },
    async getUserData() {
      let user_data = await profileSettings()
      this.currentUserStore.setData(user_data)
    }
  }
}
</script>

<style scoped></style>
