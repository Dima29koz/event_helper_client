<template>
  <v-form ref="form" @submit.prevent="submit" :disabled="!is_editable">
    <div class="d-flex">
      <v-select
        v-model="product.base_product"
        :items="base_products"
        :rules="[(v) => validateField(v, schema.base_product)]"
        item-title="name"
        return-object
        label="Продукт"
      ></v-select>
      <v-btn color="success" icon="mdi-plus"></v-btn>
    </div>

    <v-select
      v-model="product.state"
      :items="states"
      item-value="key"
      :rules="[(v) => validateField(v, schema.state)]"
      label="Статус"
    ></v-select>

    <v-row>
      <v-col>
        <v-text-field
          v-model.number="product.amount"
          :rules="[(v) => validateField(v, schema.amount)]"
          :min="0"
          label="Количество"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model.number="product.price_final"
          :rules="[(v) => validateField(v, schema.price_final)]"
          :min="0"
          label="Цена"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          :modelValue="getNumberFormat(product.amount * product.price_final)"
          label="Сумма"
          variant="solo"
          flat
          type="text"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-textarea v-model="product.description" label="Описание" auto-grow rows="2"></v-textarea>
    <v-text-field v-model="product.market" label="Магазин"></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validate_field'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { get_base_products } from '@/utils/api_event_management'
import { getNumberFormat } from '@/utils/formatters'

export default {
  name: 'event-product-form',
  setup() {
    const schema = {
      base_product: yup.object().required('Продукт не указан'),
      state: yup.string().required('Состояние не выбрано'),
      amount: yup
        .number()
        .integer('Доступны только целые значения')
        .moreThan(0, 'Количество должно быть больше 0')
        .required('Количество не указано')
        .typeError('Количество не указано'),
      price_final: yup
        .number()
        .transform((value, originalValue) => {
          return originalValue === '' ? undefined : value
        })
        .when('price_final', (price_final, schema) =>
          price_final !== '' ? schema.min(0, 'Цена должна быть больше или равна 0') : schema
        )
    }
    const eventMemberStore = useEventMemberStore()
    return { schema, eventMemberStore, validateField, getNumberFormat }
  },
  data() {
    return {
      product: this.product_data
        ? { ...this.product_data }
        : {
            base_product: null,
            state: 'added',
            amount: 0,
            price_final: '',
            description: '',
            market: ''
          },
      base_products: []
    }
  },
  props: {
    product_data: {},
    states: { default: [] },
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
    async getBaseProducts() {
      this.base_products = await get_base_products()
    },
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.onSubmit(this.product)
      }
    }
  },

  mounted() {
    this.getBaseProducts()
  }
}
</script>
