<template>
  <v-sheet class="pa-4 text-center mx-auto my-sm-16 form-register rounded" :elevation="8">
    <h1 class="h3 mb-4 fw-normal">Регистрация</h1>
    <v-form ref="form" @submit.prevent="registrateUser">
      <v-text-field
        v-model="new_user.username"
        :rules="[(v) => validateField(v, schema.username)]"
        counter="50"
        :error-messages="error"
        name="username"
        label="Логин"
      ></v-text-field>

      <v-text-field
        v-model="new_user.full_name"
        :rules="[(v) => validateField(v, schema.full_name)]"
        counter="50"
        name="name"
        label="ФИО"
      ></v-text-field>

      <v-text-field
        v-model="new_user.email"
        :rules="[(v) => validateField(v, schema.email)]"
        counter="50"
        name="email"
        label="email"
      ></v-text-field>

      <v-text-field
        v-model="new_user.phone"
        :rules="[(v) => validateField(v, schema.phone)]"
        counter="12"
        name="tel"
        label="Телефон"
      ></v-text-field>

      <v-text-field
        v-model="new_user.contacts"
        :rules="[(v) => validateField(v, schema.contacts)]"
        counter="100"
        name="contacts"
        label="Контакты"
      ></v-text-field>

      <v-text-field
        v-model="new_user.password"
        :rules="[(v) => validateField(v, schema.password)]"
        type="password"
        name="password"
        label="Пароль"
        autocomplete="new-password"
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

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'registration-form',
  setup() {
    const schema = {
      username: yup.string().max(50, 'Превышена максимальная длина').required('Поле не заполнено'),
      full_name: yup.string().max(50, 'Превышена максимальная длина').required('Поле не заполнено'),
      email: yup
        .string()
        .max(50, 'Превышена максимальная длина')
        .required('Поле не заполнено')
        .email('Некорректный ардес'),
      phone: yup.string().max(12, 'Превышена максимальная длина'),
      contacts: yup.string().max(100, 'Превышена максимальная длина'),
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
}
</style>
