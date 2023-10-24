<template>
  <v-form ref="form" @submit.prevent="submit" :disabled="!is_editable">
    <v-text-field
      v-model="member.nickname"
      :rules="[(v) => validateField(v, schema.role)]"
      label="Как к вам обращаться?"
      type="text"
    ></v-text-field>

    <div class="d-sm-flex">
      <datetime-picker
        v-model:model="member.date_from"
        :rules="[
          (v) => validateField(v, schema.date),
          (v) => validateField(v, schema.date_from(v, member.date_to))
        ]"
        :label="'Приеду (дата)'"
        :name="'date_from'"
        :minDate="eventMemberStore.getEventInfo.date_start"
        :maxDate="eventMemberStore.getEventInfo.date_end"
        class="me-sm-4"
      ></datetime-picker>

      <datetime-picker
        v-model:model="member.date_to"
        :rules="[
          (v) => validateField(v, schema.date),
          (v) => validateField(v, schema.date_to(v, member.date_from))
        ]"
        :label="'Уеду (дата)'"
        :name="'date_to'"
        :minDate="eventMemberStore.getEventInfo.date_start"
        :maxDate="eventMemberStore.getEventInfo.date_end"
        class="me-sm-4"
      ></datetime-picker>

      <v-text-field
        v-model="member.days_amount"
        label="Количество дней"
        variant="solo"
        flat
        type="number"
        readonly
      ></v-text-field>
    </div>
    <v-checkbox v-model="member.is_drinker" label="Пьющий" hide-details></v-checkbox>
    <v-checkbox v-model="member.is_involved" label="Приеду" hide-details></v-checkbox>
    <v-select
      v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
      v-model="member.role"
      :items="roles"
      item-value="key"
      :rules="[(v) => validateField(v, schema.role)]"
      label="Роль"
    ></v-select>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'
import { getDaysAmount } from '../../utils/formatters'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'event-member-form',
  setup() {
    const eventMemberStore = useEventMemberStore()
    const min_date = eventMemberStore.getEventInfo.date_start
    const max_date = eventMemberStore.getEventInfo.date_end
    const schema = {
      nickname: yup.string().required('Поле не заполнено'),
      date: yup
        .date()
        .min(min_date, 'Значение должно быть не меньше чем ' + min_date.toLocaleString())
        .max(max_date, 'Значение должно быть не больше чем ' + max_date.toLocaleString())
        .required('Дата не выбрана'),
      date_to: (v, date) =>
        yup.date().min(date ? date : v, 'Дата окончания должна быть больше даты начала'),
      date_from: (v, date) =>
        yup.date().max(date ? date : v, 'Дата начала должна быть меньше даты окончания'),
      role: yup.string().required('Роль не выбрана')
    }

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
      roles: [
        { title: 'Участник', key: 'member' },
        { title: 'Организатор', key: 'organizer' }
      ]
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
        this.member.days_amount = getDaysAmount(this.member.date_from, this.member.date_to)
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
