<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="username"
      :rules="[(v) => validateField(v, schema.username)]"
      label="Логин"
    ></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'reset-password-form',
  setup() {
    const schema = {
      username: yup.string().required('Поле не заполнено')
    }
    return { schema, validateField }
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('resetPassword', this.username)
      }
    }
  }
}
</script>
