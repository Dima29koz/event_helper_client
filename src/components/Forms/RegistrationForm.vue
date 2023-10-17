<template>
  <v-sheet class="pa-4 text-center mx-auto my-16 form-register rounded" :elevation="8">
    <h1 class="h3 mb-3 fw-normal">Регистрация</h1>
    <v-form ref="form" @submit.prevent="registrateUser">
      <v-text-field
        v-model="new_user.username"
        :rules="[(v) => validateField(v, schema.username)]"
        :error-messages="error"
        name="username"
        label="Логин"
      ></v-text-field>

      <v-text-field
        v-model="new_user.full_name"
        :rules="[(v) => validateField(v, schema.full_name)]"
        name="name"
        label="ФИО"
      ></v-text-field>

      <v-text-field
        v-model="new_user.email"
        :rules="[(v) => validateField(v, schema.email)]"
        name="email"
        label="email"
      ></v-text-field>

      <v-text-field v-model="new_user.phone" name="tel" label="Телефон"></v-text-field>

      <v-text-field v-model="new_user.contacts" name="contacts" label="Контакты"></v-text-field>

      <v-text-field
        v-model="new_user.password"
        :rules="[(v) => validateField(v, schema.password)]"
        type="password"
        name="password"
        label="Пароль"
      ></v-text-field>

      <v-text-field
        v-model="new_user.password_repeat"
        :rules="[(v) => validateField(v, schema.password_repeat(new_user.password))]"
        type="password"
        name="passwordRepeat"
        label="Повторите пароль"
      ></v-text-field>

      <v-btn type="submit" color="success" size="large" block>Создать аккаунт</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup></script>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'

export default {
  setup() {
    const schema = {
      username: yup.string().required('Поле не заполнено'),
      full_name: yup.string().required('Поле не заполнено'),
      email: yup.string().required('Поле не заполнено').email('Некорректный ардес'),
      password: yup.string().required('Поле не заполнено'),
      password_repeat: (password) => yup.string().oneOf([password, null], 'Пароли не совпадают')
    }
    return { schema, validateField }
  },
  props: {
    error: null
  },

  data() {
    return {
      new_user: {
        username: '',
        full_name: '',
        email: '',
        phone: '',
        contacts: '',
        password: '',
        password_repeat: ''
      }
    }
  },
  methods: {
    async registrateUser() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('register', this.new_user)
      }
    }
  }
}
</script>

<style scoped>
.form-register {
  width: 100%;
  max-width: 600px;
  padding: 15px;
  margin: auto;
}
</style>
