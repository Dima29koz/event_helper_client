<template>
  <VForm @submit="isLocationSubmited = true" :validation-schema="schema" ref="eventEditForm">
    <div class="form-floating">
      <Field
        v-focus
        v-model="event.title"
        name="title"
        type="text"
        class="form-control"
        placeholder="Название"
      />
      <label>Название</label>
      <ErrorMessage as="div" name="title" class="alert alert-danger p-1" />
    </div>
    <div class="row">
      <div class="col">
        <date-picker
          v-model:model="event.date_start"
          :label="'Дата начала'"
          :name="'date_start'"
        ></date-picker>
      </div>

      <div class="col">
        <date-picker
          v-model:model="event.date_end"
          :label="'Дата окончания'"
          :name="'date_end'"
        ></date-picker>
      </div>
    </div>
    <div class="form-floating">
      <Field
        as="textarea"
        v-model="event.description"
        name="description"
        class="form-control"
        placeholder="Описание"
        style="height: 100px"
      ></Field>
      <label>Описание</label>
      <ErrorMessage as="div" name="description" class="alert alert-danger p-1" />
    </div>

    <div class="form-floating">
      <Field
        v-model="event.cost_reduction_factor"
        name="cost_reduction_factor"
        type="number"
        class="form-control"
        placeholder="cost_reduction_factor"
      />
      <label>cost_reduction_factor</label>
      <ErrorMessage as="div" name="cost_reduction_factor" class="alert alert-danger p-1" />
    </div>
    <div class="form-floating">
      <h5>Изменение адреса</h5>
      <location-form
        :location="event_data.location"
        :onSubmit="submitForms"
        v-model:isSubmited="isLocationSubmited"
      ></location-form>
    </div>
  </VForm>
</template>

<script setup>
import * as yup from 'yup'

const schema = yup.object({
  title: yup.string().required('Название не указано'),
  date_start: yup.string().required('Дата не выбрана'),
  date_end: yup.string().required('Дата не выбрана'),
  cost_reduction_factor: yup.number().required().typeError('Зачение не указано')
})
</script>

<script>
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'
import DatePicker from '@/components/UI/DatePicker.vue'

import LocationForm from '@/components/Forms/LocationForm.vue'

export default {
  name: 'event-edit-form',
  data() {
    return {
      event: { ...this.event_data },
      isLocationSubmited: false
    }
  },

  components: { DatePicker, LocationForm },
  props: {
    event_data: {},
    onSubmit: {
      type: Function,
      default: null
    }
  },
  methods: {
    submitForms(location_data) {
      this.event.location = location_data
      this.onSubmit(this.event)
    }
  }
}
</script>
