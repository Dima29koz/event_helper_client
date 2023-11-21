<template>
  <v-form @submit.prevent="submit" ref="form">
    <v-text-field
      v-model="password"
      :rules="[(v) => validateField(v, schema.password)]"
      type="password"
      name="password"
      label="Пароль"
      autocomplete="new-password"
    ></v-text-field>

    <v-text-field
      v-model="password_repeat"
      :rules="[(v) => validateField(v, schema.password_repeat(password))]"
      type="password"
      name="passwordRepeat"
      label="Повторите пароль"
    ></v-text-field>

    <v-btn type="submit" color="success" size="large" block>Подтвердить</v-btn>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '@/utils/validators'

export default {
  name: 'reset-password-form',
  setup() {
    const schema = {
      password: yup.string().required('Поле не заполнено'),
      password_repeat: (password) => yup.string().oneOf([password, null], 'Пароли не совпадают')
    }
    return { schema, validateField }
  },

  data() {
    return {
      password: '',
      password_repeat: ''
    }
  },

  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('resetPassword', this.password, this.password_repeat)
      }
    }
  }
}
</script>
