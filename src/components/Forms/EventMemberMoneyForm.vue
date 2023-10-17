<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-text-field v-model.number="member.money_impact" label="Взнос" type="number"></v-text-field>
  </v-form>
</template>

<script>
export default {
  name: 'event-member-money-form',
  setup() {
    const shema = {}
    return { shema }
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
