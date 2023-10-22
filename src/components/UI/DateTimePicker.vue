<template>
  <v-text-field
    v-model="date"
    :rules="rules"
    :label="label"
    :min="toLocaleISOString(minDate)"
    :max="toLocaleISOString(maxDate)"
    type="datetime-local"
  ></v-text-field>
</template>

<script>
export default {
  name: 'datetime-picker',
  props: {
    label: { type: String, default: '<<Label>>' },
    minDate: { type: Date, default: null },
    maxDate: { type: Date, default: null },
    rules: { type: Array, default: () => [] },
    model: { type: Date, default: null }
  },
  methods: {
    toLocaleISOString(date) {
      let tmp_date = date ? new Date(date) : null
      if (tmp_date) {
        tmp_date.setMinutes(tmp_date.getMinutes() - tmp_date.getTimezoneOffset())
        tmp_date = tmp_date.toISOString().substring(0, 16)
      }
      return tmp_date
    }
  },
  computed: {
    date: {
      get() {
        return this.toLocaleISOString(this.model)
      },
      set(value) {
        let tmp_value = value ? new Date(value) : null

        if (this.minDate !== null && tmp_value < this.minDate) tmp_value = this.minDate
        if (this.maxDate !== null && tmp_value > this.maxDate) tmp_value = this.maxDate
        this.$emit('update:model', tmp_value)
      }
    }
  }
}
</script>
