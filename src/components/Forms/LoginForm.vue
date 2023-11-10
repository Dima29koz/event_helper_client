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
    <v-form ref="form" @submit.prevent="submit">
      <v-text-field
        v-model="user.username"
        :rules="[(v) => validateField(v, schema.username)]"
        :error-messages="error"
        label="Логин"
      ></v-text-field>

      <v-text-field
        v-model="user.password"
        :rules="[(v) => validateField(v, schema.password)]"
        label="Пароль"
        type="password"
      ></v-text-field>

      <v-checkbox v-model="user.remember_me" label="Запомнить меня" hide-details></v-checkbox>

      <v-btn type="submit" color="success" size="large" block>Войти</v-btn>
    </v-form>

    <v-list-item @click="dialogResetPassword = true" variant="plain" class="mt-2">
      Забыли пароль?
    </v-list-item>

    <v-dialog v-model="dialogResetPassword" width="400">
      <v-card>
        <v-card-title>
          <span class="text-h5">Сброс пароля</span>
        </v-card-title>
        <v-card-text>
          <ResetPasswordForm
            id="resetPasswordForm"
            @resetPassword="resetPassword"
          ></ResetPasswordForm>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="dialogResetPassword = false" color="red" variant="text"> Отменить </v-btn>
          <v-btn type="submit" form="resetPasswordForm" color="success" variant="text">
            Подтвердить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'
import ResetPasswordForm from '@/components/forms/ResetPasswordForm.vue'
import { reset_password_request } from '@/utils/api_user_account'

export default {
  components: { ResetPasswordForm },
  setup() {
    const schema = {
      username: yup.string().required('Поле не заполнено'),
      password: yup.string().required('Поле не заполнено')
    }
    return { schema, validateField }
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
        remember_me: false
      },
      dialogResetPassword: false,
      alertMsg: this.msg
    }
  },
  props: {
    error: null,
    msg: { type: String, default: '' }
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('login', this.user)
      }
    },
    async resetPassword(username) {
      await reset_password_request(username)
      this.dialogResetPassword = false
      this.alertMsg = 'success_resetPassword'
    }
  },
  computed: {
    alertTitle() {
      if (this.alertMsg == 'success_registration') return 'Регистрация успешна'
      if (this.alertMsg == 'success_resetPassword') return 'Запрос на сброс пароля отправлен'
      return '<alert title>'
    },
    alertText() {
      if (this.alertMsg == 'success_registration')
        return 'Проверьте вашу почту и следуйте инструкциям для её подтверждения'
      if (this.alertMsg == 'success_resetPassword')
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
