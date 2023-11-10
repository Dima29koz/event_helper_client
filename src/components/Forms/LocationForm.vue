<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model="local_location.name"
      :rules="[(v) => validateField(v, schema.name)]"
      counter="100"
      label="Название"
    ></v-text-field>

    <v-textarea
      v-model="local_location.description"
      label="Описание"
      auto-grow
      rows="2"
    ></v-textarea>

    <v-textarea
      v-model="local_location.address"
      :rules="[(v) => validateField(v, schema.address)]"
      counter="500"
      label="Адрес"
      auto-grow
      rows="2"
    ></v-textarea>

    <v-text-field
      v-model="local_location.geo"
      :rules="[(v) => validateField(v, schema.geo)]"
      counter="100"
      label="Координаты"
    ></v-text-field>

    <v-text-field
      v-model="local_location.maps_link"
      :rules="[(v) => validateField(v, schema.maps_link)]"
      counter="100"
      label="Ссылка на карту"
    ></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'location-form',
  setup() {
    const schema = {
      name: yup.string().max(100, 'Превышена максимальная длина').required('Поле не заполнено'),
      address: yup.string().max(500, 'Превышена максимальная длина').required('Поле не заполнено'),
      geo: yup.string().max(100, 'Превышена максимальная длина').required('Поле не заполнено'),
      maps_link: yup.string().max(100, 'Превышена максимальная длина').required('Поле не заполнено')
    }
    return { schema, validateField }
  },
  data() {
    return {
      local_location: this.location
        ? { ...this.location }
        : {
            name: '',
            description: '',
            address: '',
            geo: '',
            maps_link: ''
          }
    }
  },

  props: {
    location: {
      type: Object,
      default: function () {
        return {
          name: '',
          description: '',
          address: '',
          geo: '',
          maps_link: '',
          id: ''
        }
      }
    },
    onSubmit: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.onSubmit(this.local_location)
      }
    },
    async validate() {
      return (await this.$refs.form.validate()).valid
    }
  },
  watch: {
    location() {
      this.local_location = { ...this.location }
    }
  }
}
</script>
