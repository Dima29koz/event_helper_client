<template>
  <v-sheet class="pa-4 text-center mx-auto my-16 form-signin rounded" :elevation="8">
    <h1 class="h3 mb-3 fw-normal">Авторизация</h1>
    <v-form ref="form" @submit.prevent="submit">
      <v-text-field
        v-model="user.username"
        :rules="usernameRules"
        :error-messages="error"
        label="Логин"
      ></v-text-field>

      <v-text-field
        v-model="user.password"
        :rules="passwordRules"
        label="Пароль"
        type="password"
      ></v-text-field>
      <v-checkbox v-model="user.remember_me" label="Запомнить меня"></v-checkbox>

      <v-btn type="submit" color="success" size="large" block>Войти</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'

export default {
  setup() {
    const schema = {
      username: yup.string().required('Поле не заполнено'),
      password: yup.string().required('Поле не заполнено')
    }
    return { schema }
  },
  data: (vm) => ({
    user: {
      username: 'Admin',
      password: '1234',
      remember_me: false
    },
    usernameRules: [(v) => validateField(v, vm.schema.username)],
    passwordRules: [(v) => validateField(v, vm.schema.password)]
  }),
  props: {
    error: null
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('login', this.user)
      }
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
