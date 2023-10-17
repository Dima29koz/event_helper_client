<template>
  <VueDatePicker
    v-model="dateTime"
    :start-time="{ hours: 12, minutes: 0 }"
    :min-date="minDate"
    :max-date="maxDate"
    :start-date="minDate"
    prevent-min-max-navigation
    month-name-format="long"
    locale="ru"
    format="dd.MM.yyyy HH:mm"
    time-picker-inline
    minutes-increment="15"
    no-hours-overlay
    no-minutes-overlay
    auto-apply
  >
    <template #dp-input="{ value }">
      <v-text-field
        :modelValue="value"
        :validateOnBlur="false"
        :rules="rules"
        :label="label"
        readonly
        density="compact"
      ></v-text-field>
    </template>
  </VueDatePicker>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
export default {
  name: 'date-picker',
  components: { VueDatePicker },
  props: {
    label: {
      type: String,
      default: '<<Label goes here>>'
    },
    name: {
      type: String,
      default: '<<Name goes here>>'
    },
    minDate: null,
    maxDate: null,
    rules: { type: Array, default: () => [] },
    model: null
  },
  computed: {
    dateTime: {
      get() {
        return this.model
      },
      set(newValue) {
        this.$emit('update:model', newValue)
      }
    }
  }
}
</script>
