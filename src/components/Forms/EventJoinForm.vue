<template>
  <v-form ref="form" @submit.prevent="this.onSubmit(this.key)">
    <v-text-field
      v-model="key"
      name="event_key"
      :rules="[(v) => validateField(v, schema.key)]"
      label="Ключ события"
    ></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'event-join-form',
  setup() {
    const schema = {
      key: yup.string().required('Поле не заполнено')
    }
    return { schema, validateField }
  },
  data() {
    return {
      key: ''
    }
  },
  props: {
    onSubmit: {
      type: Function,
      default: null
    }
  }
}
</script>
