<template>
  <div>
    <VueDatePicker
      v-model="dateTime"
      :start-time="{ hours: 12, minutes: 0 }"
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
        <div class="form-floating">
          <Field
            :modelValue="value"
            :validateOnBlur="false"
            :name="name"
            type="text"
            class="form-control"
          />
          <label>{{ label }}</label>
        </div>
      </template>
    </VueDatePicker>
    <ErrorMessage as="div" :name="name" class="alert alert-danger p-1" />
  </div>
</template>

<script>
import { Field, ErrorMessage } from 'vee-validate'

export default {
  name: 'date-picker',
  components: { Field, ErrorMessage },
  props: {
    label: {
      type: String,
      default: '<<Label goes here>>'
    },
    name: {
      type: String,
      default: '<<Name goes here>>'
    },
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
