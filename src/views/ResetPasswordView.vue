<template>
  <v-sheet
    v-if="!isConfirmed"
    class="pa-4 text-center mx-auto my-16 form-reset-pwd rounded"
    :elevation="8"
  >
    <h1 class="h3 mb-3 fw-normal">Сброс пароля</h1>
    <v-form @submit.prevent="submit" ref="form">
      <v-text-field
        v-model="user.password"
        :rules="[(v) => validateField(v, schema.password)]"
        type="password"
        name="password"
        label="Пароль"
      ></v-text-field>

      <v-text-field
        v-model="user.password_repeat"
        :rules="[(v) => validateField(v, schema.password_repeat(user.password))]"
        type="password"
        name="passwordRepeat"
        label="Повторите пароль"
      ></v-text-field>

      <v-btn type="submit" color="success" size="large" block>Подтвердить</v-btn>
    </v-form>
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
import * as yup from 'yup'
import { validateField } from '@/utils/validate_field'

import { reset_password } from '@/utils/api_user_account'

export default {
  setup() {
    const schema = {
      password: yup.string().required('Поле не заполнено'),
      password_repeat: (password) => yup.string().oneOf([password, null], 'Пароли не совпадают')
    }
    return { schema, validateField }
  },
  data() {
    return {
      user: {
        password: '',
        password_repeat: ''
      },
      token: '',
      isConfirmed: false
    }
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        await reset_password(this.token, this.user.password, this.user.password_repeat)
        this.isConfirmed = true
      }
    }
  },
  computed: {
    hintText() {
      if (this.confirmationMsg == 'Wrong token') return 'Ошибка в токене'
      return this.confirmationMsg
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
