<template>
  <VForm @submit="onBeforeSubmit" :validation-schema="schema" ref="eventEditForm">
    <div class="form-floating">
      <Field
        v-focus
        v-model="member.nickname"
        name="nickname"
        type="text"
        class="form-control"
        placeholder="Как к вам обращаться?"
      />
      <label>Как к вам обращаться?</label>
      <ErrorMessage as="div" name="nickname" class="alert alert-danger p-1" />
    </div>

    <div class="row">
      <div class="col">
        <date-picker
          v-model:model="member.date_from"
          :label="'Приеду (дата)'"
          :name="'date_from'"
        ></date-picker>
      </div>

      <div class="col">
        <date-picker
          v-model:model="member.date_to"
          :label="'Уеду (дата)'"
          :name="'date_to'"
        ></date-picker>
      </div>
      <div class="col">
        <div class="form-floating">
          <Field
            v-model="member.days_amount"
            name="days_amount"
            type="number"
            class="form-control-plaintext"
            placeholder="Количество дней"
            readonly
          ></Field>
          <label>Количество дней</label>
        </div>
      </div>
    </div>

    <div class="form-check text-start my-3">
      <Field
        as="input"
        v-model="member.is_drinker"
        ref="checkDrinker"
        name="is_drinker"
        type="checkbox"
        :value="true"
        class="form-check-input"
      />

      <label class="form-check-label"> Пьющий </label>
      <ErrorMessage as="div" name="is_drinker" class="alert alert-danger p-1" />
    </div>
    <div class="form-check text-start my-3">
      <Field
        v-model="member.is_involved"
        name="is_involved"
        type="checkbox"
        :value="true"
        class="form-check-input"
        checked
      />

      <label class="form-check-label"> Приеду </label>
      <ErrorMessage as="div" name="is_involved" class="alert alert-danger p-1" />
    </div>
    <div class="form-floating">
      <Field
        as="select"
        v-model="member.role"
        name="role"
        class="form-select"
        aria-label="Выберите один из вариантов"
      >
        <option selected disabled value="">Выберите роль</option>
        <option v-for="(role, index) in roles" :key="index" v-bind:value="role">
          {{ role }}
        </option>
      </Field>
      <label>Роль</label>
      <ErrorMessage as="div" name="role" class="alert alert-danger p-1" />
    </div>
  </VForm>
</template>

<script setup>
import * as yup from 'yup'

const schema = yup.object({
  nickname: yup.string().required('Поле не заполнено'),
  date_from: yup.string().required('Дата не выбрана'),
  date_to: yup.string().required('Дата не выбрана')
})
</script>

<script>
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'
import DatePicker from '@/components/UI/DatePicker.vue'

export default {
  name: 'event-member-form',
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
    onSubmit: {
      type: Function,
      default: null
    }
  },

  methods: {
    setDaysAmount() {
      this.member.days_amount = Math.ceil(
        (this.member.date_to.getTime() - this.member.date_from.getTime()) / (1000 * 3600 * 24)
      )
    },
    onBeforeSubmit() {
      this.member.is_drinker = this.member.is_drinker === undefined ? false : true
      this.member.is_involved = this.member.is_involved === undefined ? false : true
      this.onSubmit(this.member)
    }
  },

  watch: {
    'member.date_from'() {
      if (this.member.date_to && this.member.date_from) {
        this.setDaysAmount()
      }
    },
    'member.date_to'() {
      if (this.member.date_to && this.member.date_from) {
        this.setDaysAmount()
      }
    }
  }
}
</script>
