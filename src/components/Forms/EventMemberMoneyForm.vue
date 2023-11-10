<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field
      v-model.number="member.money_impact"
      :rules="[(v) => validateField(v, schema.money_impact)]"
      label="Взнос"
      type="number"
    ></v-text-field>
  </v-form>
</template>

<script>
import { validateField, validateMonetary } from '../../utils/validators'

export default {
  name: 'event-member-money-form',
  setup() {
    const schema = {
      money_impact: validateMonetary
    }
    return { schema, validateField }
  },
  data() {
    return {
      member: {
        id: this.member_data.id,
        money_impact: this.member_data.money_impact
      }
    }
  },
  props: {
    member_data: {},
    onSubmit: {
      type: Function,
      default: null
    }
  },
  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.onSubmit(this.member)
      }
    }
  }
}
</script>
