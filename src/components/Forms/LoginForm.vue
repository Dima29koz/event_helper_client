<template>
  <div class="form-signin">
    <h1 class="h3 mb-3 fw-normal">Авторизация</h1>
    <v-form ref="form">
      <v-text-field v-model="user.username" :rules="usernameRules" label="Логин"></v-text-field>

      <v-text-field
        v-model="user.password"
        :rules="passwordRules"
        label="Пароль"
        type="password"
      ></v-text-field>
      <v-checkbox v-model="user.remember_me" label="Запомнить меня"></v-checkbox>

      <v-btn @click="submit">Войти</v-btn>
    </v-form>
  </div>
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
  padding: 15px;
  margin: auto;
}
</style>
