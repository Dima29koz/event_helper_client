<template>
  <v-form ref="form" @submit.prevent="submit" :disabled="!is_editable">
    <v-text-field
      v-model="member.nickname"
      :rules="[(v) => validateField(v, schema.role)]"
      label="Как к вам обращаться?"
      type="text"
    ></v-text-field>

    <v-row>
      <v-col>
        <date-picker
          v-model:model="member.date_from"
          :rules="[(v) => validateField(v, schema.date_from)]"
          :label="'Приеду (дата)'"
          :name="'date_from'"
        ></date-picker>
      </v-col>
      <v-col>
        <date-picker
          v-model:model="member.date_to"
          :rules="[(v) => validateField(v, schema.date_to)]"
          :label="'Уеду (дата)'"
          :name="'date_to'"
        ></date-picker>
      </v-col>
      <v-col>
        <v-text-field
          v-model="member.days_amount"
          label="Количество дней"
          variant="solo"
          flat
          type="number"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-checkbox v-model="member.is_drinker" label="Пьющий"></v-checkbox>
    <v-checkbox v-model="member.is_involved" label="Приеду"></v-checkbox>
    <v-select
      v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
      v-model="member.role"
      :items="roles"
      :rules="[(v) => validateField(v, schema.role)]"
      label="Роль"
    ></v-select>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'event-member-form',
  setup() {
    const schema = {
      nickname: yup.string().required('Поле не заполнено'),
      date_from: yup.string().required('Дата не выбрана'),
      date_to: yup.string().required('Дата не выбрана'),
      role: yup.string().required('Роль не выбрана')
    }
    const eventMemberStore = useEventMemberStore()
    return { schema, eventMemberStore, validateField }
  },
  data() {
    return {
      member: this.member_data
        ? { ...this.member_data }
        : {
            nickname: '',
            days_amount: 0,
            date_from: null,
            date_to: null,
            is_drinker: false,
            is_involved: true,
            role: 'member',
            user_id: null
          },
      roles: ['member', 'organizer']
    }
  },

  props: {
    member_data: {},
    is_editable: {
      type: Boolean,
      default: false
    },
    onSubmit: {
      type: Function,
      default: null
    }
  },

  methods: {
    setDaysAmount() {
      if (this.member.date_to && this.member.date_from) {
        this.member.days_amount = Math.ceil(
          (this.member.date_to.getTime() - this.member.date_from.getTime()) / (1000 * 3600 * 24)
        )
      } else {
        this.member.days_amount = 0
      }
    },
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.onSubmit(this.member)
      }
    }
  },

  watch: {
    'member.date_from'() {
      this.setDaysAmount()
    },
    'member.date_to'() {
      this.setDaysAmount()
    }
  }
}
</script>
