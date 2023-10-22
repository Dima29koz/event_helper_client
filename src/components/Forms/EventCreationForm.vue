<template>
  <v-form @submit.prevent="submit" ref="eventForm">
    <v-text-field
      v-model="event.title"
      :rules="[(v) => validateField(v, schema.title)]"
      label="Название"
    ></v-text-field>
    <v-select
      v-model="event.location_id"
      :items="locations"
      :rules="[(v) => validateField(v, schema.location_id)]"
      item-title="name"
      item-value="id"
      label="Адрес"
    ></v-select>
    <v-row>
      <v-col>
        <datetime-picker
          id="date_start"
          v-model:model="event.date_start"
          :rules="[(v) => validateField(v, schema.date_start(v, event.date_end))]"
          label="Дата начала"
        ></datetime-picker>
      </v-col>
      <v-col>
        <datetime-picker
          id="date_end"
          v-model:model="event.date_end"
          :rules="[(v) => validateField(v, schema.date_end(v, event.date_start))]"
          label="Дата окончания"
        ></datetime-picker>
      </v-col>
    </v-row>
    <v-textarea v-model="event.description" label="Описание" auto-grow rows="2"></v-textarea>
    <v-text-field
      v-model="event.cost_reduction_factor"
      :rules="[(v) => validateField(v, schema.cost_reduction_factor)]"
      label="cost_reduction_factor"
      type="number"
    ></v-text-field>
  </v-form>
</template>

<script setup>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'

const schema = {
  title: yup.string().required('Название не указано'),
  location_id: yup.number().required('Адрес не указан').typeError('Адрес не указан'),
  date_start: (v, date) =>
    yup
      .date()
      .max(date ? date : v, 'Дата начала должна быть меньше даты окончания')
      .required('Дата не выбрана'),
  date_end: (v, date) =>
    yup
      .date()
      .min(date ? date : v, 'Дата окончания должна быть больше даты начала')
      .required('Дата не выбрана'),
  cost_reduction_factor: yup.number().required().typeError('Зачение не указано')
}
</script>

<script>
import { get_locations } from '@/utils/api_user_account'

export default {
  name: 'event-creation-form',
  data() {
    return {
      event: {
        title: '',
        description: '',
        date_start: null,
        date_end: null,
        timezone: '+0300',
        cost_reduction_factor: 25,
        location_id: ''
      },
      locations: []
    }
  },
  props: {
    onSubmit: {
      type: Function,
      default: null
    }
  },

  methods: {
    async getLocations() {
      this.locations = await get_locations()
    },
    async submit() {
      if ((await this.$refs.eventForm.validate()).valid) {
        this.onSubmit(this.event)
      }
    }
  },

  mounted() {
    this.getLocations()
  }
}
</script>
