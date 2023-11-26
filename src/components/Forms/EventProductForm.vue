<template>
  <v-form ref="form" @submit.prevent="submit" :disabled="!is_editable">
    <v-autocomplete
      v-model="product.base_product"
      v-model:search="searchProduct"
      :items="base_products"
      :rules="[(v) => validateField(v, schema.base_product)]"
      item-title="name"
      return-object
      no-data-text="Продукт не найден"
      auto-select-first
      label="Продукт"
    ></v-autocomplete>

    <v-row no-gutters class="flex-column flex-sm-row">
      <v-col class="me-sm-4">
        <v-select
          v-model="product.state"
          :items="states"
          item-value="key"
          :rules="[(v) => validateField(v, schema.state)]"
          label="Статус"
        ></v-select>
      </v-col>

      <v-col>
        <v-select
          v-model="product.buyer_id"
          :readonly="product.state !== 'bought'"
          :items="eventStore.members"
          item-title="nickname"
          item-value="id"
          label="Кем куплен"
        ></v-select>
      </v-col>
    </v-row>

    <v-row no-gutters class="flex-column flex-md-row">
      <v-col class="me-md-4">
        <v-row no-gutters>
          <v-col class="me-4">
            <v-text-field
              v-model.number="product.amount"
              :rules="[(v) => validateField(v, schema.amount(product.base_product.unit.name))]"
              :min="0"
              label="Количество"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model.number="product.price_supposed"
              :rules="[(v) => validateField(v, schema.price_supposed)]"
              @blur="product.price_supposed = Number(product.price_supposed.toFixed(2))"
              :min="0"
              label="Предполагаемая цена"
              type="number"
              class="text-truncate"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-row no-gutters>
          <v-col class="me-4">
            <v-text-field
              v-model.number="product.price_final"
              :rules="[(v) => validateField(v, schema.price_final)]"
              @blur="product.price_final = Number(product.price_final.toFixed(2))"
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
      </v-col>
    </v-row>

    <v-textarea v-model="product.description" label="Описание" auto-grow rows="2"></v-textarea>

    <v-text-field
      v-model="product.market"
      :rules="[(v) => validateField(v, schema.market)]"
      counter="50"
      label="Магазин"
    ></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { useEventStore } from '@/stores/eventStore'
import { get_base_products } from '@/utils/api_event_management'
import { getNumberFormat } from '@/utils/formatters'

export default {
  name: 'event-product-form',
  setup() {
    const schema = {
      base_product: yup.object().required('Продукт не указан'),
      state: yup.string().required('Состояние не выбрано'),
      amount: (unit_name) => {
        const baseValidation = yup
          .number()
          .moreThan(0, 'Количество должно быть больше 0')
          .required('Количество не указано')
          .typeError('Количество не указано')

        return unit_name === 'кг.'
          ? baseValidation.test(
              'three-decimals',
              'Значение задается с точностью до 3х знаков',
              (value) => /^\d+(\.\d{1,3})?$/.test(value)
            )
          : baseValidation.integer('Доступны только целые значения')
      },
      price_final: yup
        .number()
        .min(0, 'Цена должна быть больше или равна 0')
        .test('two-decimals', 'Цена должна иметь не более двух десятичных знаков', (value) =>
          /^\d+(\.\d{1,2})?$/.test(value)
        )
        .typeError('Цена не указана'),
      price_supposed: yup
        .number()
        .min(0, 'Цена должна быть больше или равна 0')
        .test('two-decimals', 'Цена должна иметь не более двух десятичных знаков', (value) =>
          /^\d+(\.\d{1,2})?$/.test(value)
        )
        .typeError('Цена не указана'),
      market: yup.string().nullable().max(50, 'Превышена максимальная длина')
    }
    const eventMemberStore = useEventMemberStore()
    const eventStore = useEventStore()
    return { schema, eventMemberStore, validateField, getNumberFormat, eventStore }
  },
  data() {
    return {
      product: this.product_data
        ? { ...this.product_data }
        : {
            base_product: null,
            state: 'added',
            amount: 0,
            price_final: NaN,
            description: '',
            market: '',
            buyer_id: ''
          },
      base_products: [],
      searchProduct: ''
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
  watch: {
    'product.base_product'() {
      if (this.product.base_product === null) {
        this.searchProduct = ''
      }
    },
    'product.state'(newVal) {
      if (newVal !== 'bought') {
        this.product.buyer_id = null
      } else {
        this.product.buyer_id = this.eventStore.selected_buyer?.id
      }
    }
  },

  mounted() {
    this.getBaseProducts()
  }
}
</script>
