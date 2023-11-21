<template>
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
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'login-form',
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
      }
    }
  },
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
