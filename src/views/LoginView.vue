<template>
  <v-sheet class="pa-4 text-center mx-auto my-16 form-signin rounded" :elevation="8">
    <h1 class="h3 mb-4 fw-normal">Авторизация</h1>
    <v-alert
      v-if="alertMsg"
      border="start"
      :color="alertType"
      closable
      :title="alertTitle"
      :text="alertText"
      class="mb-4 text-start"
    ></v-alert>
    <login-form @login="loginUser" :error="error"></login-form>

    <v-list-item @click="dialogResetPasswordRequest = true" variant="plain" class="mt-2">
      Забыли пароль?
    </v-list-item>

    <v-dialog v-model="dialogResetPasswordRequest" width="400">
      <v-card>
        <v-card-title>
          <span class="text-h5">Сброс пароля</span>
        </v-card-title>
        <v-card-text>
          <reset-password-request-form
            id="resetPasswordRequestForm"
            @resetPasswordRequest="resetPasswordRequest"
          ></reset-password-request-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="dialogResetPasswordRequest = false" color="red" variant="text">
            Отменить
          </v-btn>
          <v-btn type="submit" form="resetPasswordRequestForm" color="success" variant="text">
            Подтвердить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import LoginForm from '@/components/Forms/LoginForm.vue'
import resetPasswordRequestForm from '@/components/forms/resetPasswordRequestForm.vue'
import { login, profileSettings, reset_password_request } from '@/utils/api_user_account'

import { useCurrentUserStore } from '../stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },
  components: {
    LoginForm,
    resetPasswordRequestForm
  },
  data() {
    return {
      error: null,
      alertMsg: 'msg' in this.$route.query ? this.$route.query.msg : '',
      dialogResetPasswordRequest: false
    }
  },
  methods: {
    async loginUser(user) {
      const res = await login(user.username, user.password, user.remember_me)
      if (res?.msg === 'Wrong username or password') {
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
    },
    async resetPasswordRequest(username) {
      await reset_password_request(username)
      this.dialogResetPasswordRequest = false
      this.alertMsg = 'success_resetPasswordRequest'
    }
  },
  computed: {
    alertTitle() {
      if (this.alertMsg == 'success_registration') return 'Регистрация успешна'
      if (this.alertMsg == 'success_resetPasswordRequest') return 'Запрос на сброс пароля отправлен'
      return '<alert title>'
    },
    alertText() {
      if (this.alertMsg == 'success_registration')
        return 'Проверьте вашу почту и следуйте инструкциям для её подтверждения'
      if (this.alertMsg == 'success_resetPasswordRequest')
        return 'Проверьте вашу почту и следуйте инструкциям для сброса пароля'
      return '<alert text>'
    },
    alertType() {
      return this.alertMsg.split('_')[0]
    }
  }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
}
</style>
