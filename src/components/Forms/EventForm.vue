<template>
  <v-form @submit.prevent="submit" ref="eventForm">
    <v-text-field
      v-model="event.title"
      :rules="[(v) => validateField(v, schema.title)]"
      label="Название"
    ></v-text-field>
    <div class="d-sm-flex">
      <datetime-picker
        id="date_start"
        v-model:model="event.date_start"
        :rules="[(v) => validateField(v, schema.date_start(event.date_end))]"
        label="Дата начала"
        class="me-sm-4"
      ></datetime-picker>
      <datetime-picker
        id="date_end"
        v-model:model="event.date_end"
        :rules="[(v) => validateField(v, schema.date_end(event.date_start))]"
        label="Дата окончания"
      ></datetime-picker>
    </div>
    <v-textarea v-model="event.description" label="Описание" auto-grow rows="2"></v-textarea>
    <v-text-field
      v-model.number="event.cost_reduction_factor"
      :rules="[(v) => validateField(v, schema.cost_reduction_factor)]"
      label="Коэффициент уменьшения взноса"
      suffix="%"
      type="number"
    >
      <template v-slot:append-inner>
        <v-tooltip location="bottom" v-model="showTooltip">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              @click="showTooltip = !showTooltip"
              icon="mdi-help-circle-outline"
            ></v-icon>
          </template>
          <p>Данное значение влияет на расчет взноса участника.</p>
          <p>Взнос уменьшается на указанный процент за каждый день отсутсвия.</p>
        </v-tooltip>
      </template>
    </v-text-field>
    <h5>Адрес</h5>
    <v-select
      v-model="event.location_id"
      @update:modelValue="setLocationData"
      :items="locations"
      item-title="name"
      item-value="id"
      label="Адрес"
    ></v-select>
    <location-form
      ref="locationForm"
      :location="event.location"
      :onSubmit="submitForms"
    ></location-form>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'
import LocationForm from '@/components/Forms/LocationForm.vue'
import { get_locations, get_location } from '@/utils/api_user_account'
import { MAX_DATE } from '@/utils/constants'

export default {
  name: 'event-form',
  components: { LocationForm },
  setup() {
    const schema = {
      title: yup.string().required('Название не указано'),
      date_start: (date) =>
        yup
          .date()
          .max(date ? date : MAX_DATE, 'Дата начала должна быть меньше даты окончания')
          .required('Дата не выбрана'),
      date_end: (date) =>
        yup
          .date()
          .min(date ? date : 0, 'Дата окончания должна быть больше даты начала')
          .required('Дата не выбрана'),
      cost_reduction_factor: yup.number().required().typeError('Зачение не указано')
    }
    return { schema, validateField }
  },
  data() {
    return {
      event: this.event_data
        ? { ...this.event_data }
        : {
            title: '',
            description: '',
            date_start: null,
            date_end: null,
            timezone: '+0300',
            cost_reduction_factor: 25,
            location_id: '',
            location: {}
          },
      locations: [],
      showTooltip: false
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
    async getLocations() {
      this.locations = await get_locations()
    },
    async setLocationData() {
      this.event.location = await get_location(this.event.location_id)
    },
    async submit() {
      const is_valid_event = (await this.$refs.eventForm.validate()).valid
      const is_valid_location = await this.$refs.locationForm.validate()
      if (is_valid_event && is_valid_location) {
        this.$refs.locationForm.submit()
      }
    },
    submitForms(location_data) {
      this.event.location = location_data
      this.onSubmit(this.event)
    }
  },

  mounted() {
    this.getLocations()
  }
}
</script>
