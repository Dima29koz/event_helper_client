<template>
  <v-form @submit.prevent="submit" ref="eventForm">
    <v-text-field
      v-model="event.title"
      :rules="[(v) => validateField(v, schema.title)]"
      counter="50"
      label="Название"
    ></v-text-field>

    <div class="d-sm-flex">
      <datetime-picker
        ref="date_start"
        id="date_start"
        v-model:model="event.date_start"
        :rules="[(v) => validateField(v, schema.date_start(event.date_end))]"
        label="Дата начала"
        class="me-sm-4"
      ></datetime-picker>
      <datetime-picker
        ref="date_end"
        id="date_end"
        v-model:model="event.date_end"
        :rules="[(v) => validateField(v, schema.date_end(event.date_start))]"
        label="Дата окончания"
      ></datetime-picker>
    </div>

    <tiptap-editor v-model="event.description" />

    <v-text-field
      v-model.number="event.cost_reduction_factor"
      :rules="[(v) => validateField(v, schema.cost_reduction_factor)]"
      label="Коэффициент уменьшения взноса"
      suffix="%"
      type="number"
    >
      <template v-slot:append-inner>
        <v-switchable-tooltip>
          <p>Данное значение влияет на расчет взноса участника.</p>
          <p>Взнос уменьшается на указанный процент за каждый день отсутсвия.</p>
        </v-switchable-tooltip>
      </template>
    </v-text-field>

    <h5 class="pb-2">Адрес</h5>
    <v-autocomplete
      v-model="event.location_id"
      v-model:search="searchLocation"
      :items="locations"
      item-title="name"
      item-value="id"
      no-data-text="Адрес не найден"
      auto-select-first
      label="Адрес"
    ></v-autocomplete>

    <location-form
      ref="locationForm"
      :location="event.location"
      :onSubmit="submitForms"
    ></location-form>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'
import LocationForm from '@/components/Forms/LocationForm.vue'
import { get_locations, get_location } from '@/utils/api_user_account'
import { MAX_DATE } from '@/utils/constants'

export default {
  name: 'event-form',
  components: { LocationForm },
  setup() {
    const schema = {
      title: yup.string().max(50, 'Превышена максимальная длина').required('Название не указано'),
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
      searchLocation: ''
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

  watch: {
    'event.location_id'() {
      if (this.event.location_id !== null) {
        this.setLocationData()
      } else {
        this.searchLocation = ''
      }
    },
    'event.date_start'() {
      this.$refs.date_end.validate()
    },
    'event.date_end'() {
      this.$refs.date_start.validate()
    }
  },

  mounted() {
    this.getLocations()
  }
}
</script>
