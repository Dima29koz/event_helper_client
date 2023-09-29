<template>
  <VForm @submit="this.onSubmit(this.event)" :validation-schema="schema" ref="eventForm">
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
    <div class="form-floating">
      <Field
        as="select"
        v-model="event.location_id"
        name="location_id"
        class="form-select"
        aria-label="Выберите один из вариантов"
      >
        <option selected disabled value="">Укажите адрес</option>
        <option v-for="location in locations" :key="location.id" v-bind:value="location.id">
          {{ location.name }}
        </option>
      </Field>
      <label>Адрес</label>
      <ErrorMessage as="div" name="location_id" class="alert alert-danger p-1" />
    </div>

    <div class="row">
      <div class="col">
        <div class="form-floating">
          <Field
            v-model="event.date_start"
            name="date_start"
            type="datetime-local"
            class="form-control"
            placeholder="Дата начала"
          />
          <label>Дата начала</label>
          <ErrorMessage as="div" name="date_start" class="alert alert-danger p-1" />
        </div>
      </div>
      <div class="col">
        <div class="form-floating">
          <Field
            v-model="event.date_end"
            name="date_end"
            type="datetime-local"
            class="form-control"
            placeholder="Дата окончания"
          />
          <label>Дата окончания</label>
          <ErrorMessage as="div" name="date_end" class="alert alert-danger p-1" />
        </div>
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
  </VForm>
</template>

<script setup>
import * as yup from 'yup'

const schema = yup.object({
  title: yup.string().required('Название не указано'),
  location_id: yup.number().required('Адрес не указан').typeError('Адрес не указан'),
  date_start: yup.date().required().typeError('Дата не выбрана'),
  date_end: yup.date().required().typeError('Дата не выбрана'),
  cost_reduction_factor: yup.number().required().typeError('Зачение не указано')
})
</script>

<script>
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'

import { get_locations } from '@/utils/api_user_account'

export default {
  name: 'event-form',
  data() {
    return {
      event: {
        title: '',
        description: '',
        date_start: '',
        date_end: '',
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
      console.log(typeof this.onSubmit)
      this.locations = await get_locations()
    }
  },

  mounted() {
    this.getLocations()
  }
}
</script>
