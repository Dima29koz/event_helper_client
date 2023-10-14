<template>
  <v-form ref="eventEditForm" @submit.prevent="submit">
    <v-text-field
      v-model="event.title"
      :rules="[(v) => validateField(v, schema.title)]"
      label="Название"
    ></v-text-field>

    <v-row>
      <v-col>
        <date-picker
          id="date_start"
          v-model:model="event.date_start"
          :rules="[(v) => validateField(v, schema.date_start)]"
          :label="'Дата начала'"
        ></date-picker>
      </v-col>
      <v-col>
        <date-picker
          id="date_end"
          v-model:model="event.date_end"
          :rules="[(v) => validateField(v, schema.date_end)]"
          label="Дата окончания"
        ></date-picker>
      </v-col>
    </v-row>

    <v-textarea v-model="event.description" label="Описание" auto-grow rows="2"></v-textarea>

    <v-text-field
      v-model="event.cost_reduction_factor"
      :rules="[(v) => validateField(v, schema.cost_reduction_factor)]"
      label="cost_reduction_factor"
      type="number"
    ></v-text-field>
    <div>
      <h5>Изменение адреса</h5>
      <location-form
        ref="locationForm"
        :location="event_data.location"
        :onSubmit="submitForms"
      ></location-form>
    </div>
  </v-form>
</template>

<script setup>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'

const schema = {
  title: yup.string().required('Название не указано'),
  date_start: yup.string().required('Дата не выбрана'),
  date_end: yup.string().required('Дата не выбрана'),
  cost_reduction_factor: yup.number().required().typeError('Зачение не указано')
}
</script>

<script>
import LocationForm from '@/components/Forms/LocationForm.vue'

export default {
  name: 'event-edit-form',
  data() {
    return {
      event: { ...this.event_data }
    }
  },
  props: {
    event_data: {},
    onSubmit: {
      type: Function,
      default: null
    }
  },
  methods: {
    async submit() {
      if ((await this.$refs.eventEditForm.validate()).valid) {
        this.$refs.locationForm.submit()
      }
    },
    submitForms(location_data) {
      this.event.location = location_data
      this.onSubmit(this.event)
    }
  }
}
</script>
