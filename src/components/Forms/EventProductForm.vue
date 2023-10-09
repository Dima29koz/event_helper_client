<template>
  <v-form ref="form" @submit="submit" :disabled="!is_editable">
    <div class="d-flex">
      <v-select
        v-model="product.base_product"
        :items="base_products"
        :rules="[(v) => validateField(v, schema.base_product)]"
        item-title="name"
        item-value="id"
        label="Продукт"
      ></v-select>
      <v-btn color="success" icon="mdi-plus"></v-btn>
    </div>

    <v-select
      v-model="product.state"
      :items="product_states"
      :rules="[(v) => validateField(v, schema.state)]"
      label="Статус"
    ></v-select>

    <v-row>
      <v-col>
        <v-text-field
          v-model="product.amount"
          :rules="[(v) => validateField(v, schema.amount)]"
          label="Количество"
          type="number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field v-model="product.price_final" label="Цена" type="number"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          :modelValue="product.amount * product.price_final"
          label="Итоговая стоимость"
          type="number"
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

export default {
  name: 'event-product-form',
  setup() {
    const schema = {
      base_product: yup.number().required('Продукт не указан'),
      state: yup.string().required('Состояние не выбрано'),
      amount: yup.number().required('Количество не указано')
    }
    const eventMemberStore = useEventMemberStore()
    return { schema, eventMemberStore, validateField }
  },
  data() {
    return {
      product: this.product_data
        ? { ...this.product_data }
        : {
            base_product: null,
            state: 'added',
            amount: 0,
            price_final: 0,
            description: '',
            market: ''
          },
      base_products: [],
      product_states: ['not_added', 'added', 'in_cart', 'bought']
    }
  },
  props: {
    product_data: {},
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
