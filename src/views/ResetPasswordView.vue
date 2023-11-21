<template>
  <v-sheet
    v-if="!isConfirmed"
    class="pa-4 text-center mx-auto my-16 form-reset-pwd rounded"
    :elevation="8"
  >
    <h1 class="h3 mb-3 fw-normal">Сброс пароля</h1>
    <v-alert
      v-if="alertMsg"
      border="start"
      :color="alertType"
      closable
      :title="alertTitle"
      :text="alertText"
      class="mb-4 text-start"
    ></v-alert>
    <reset-password-form @resetPassword="resetPassword"></reset-password-form>
  </v-sheet>
  <v-sheet
    v-else
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 text-center mx-auto my-16"
  >
    <template v-if="isConfirmed">
      <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
      <h2 class="text-h5 mb-6">Пароль изменен</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">Вы можете закрыть это окно</p>
    </template>
  </v-sheet>
</template>

<script>
import ResetPasswordForm from '@/components/Forms/ResetPasswordForm.vue'
import { reset_password } from '@/utils/api_user_account'

export default {
  components: { ResetPasswordForm },

  data() {
    return {
      token: '',
      isConfirmed: false,
      alertMsg: null
    }
  },

  methods: {
    async resetPassword(password, password_repeat) {
      const res = await reset_password(this.token, password, password_repeat)
      if (res?.msg === 'Wrong token') {
        this.alertMsg = 'error_token'
        this.isConfirmed = false
      } else {
        this.alertMsg = null
        this.isConfirmed = true
      }
    }
  },

  computed: {
    alertTitle() {
      if (this.alertMsg == 'error_token') return 'Ошибка в токене'
      return '<alert title>'
    },
    alertText() {
      if (this.alertMsg == 'error_token')
        return 'Возможно время действия токена истекло. Отправьте повторный запрос на сброс пароля.'
      return '<alert text>'
    },
    alertType() {
      return this.alertMsg.split('_')[0]
    }
  },

  mounted() {
    this.token = this.$route.query.token
  }
}
</script>

<style scoped>
.form-reset-pwd {
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
}
</style>
