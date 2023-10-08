<!-- broken -->

<template>
  <VForm @submit="onSubmit(product)" :validation-schema="schema" ref="productForm">
    <fieldset :disabled="!is_editable">
      <div class="input-group">
        <div class="form-floating">
          <Field
            as="select"
            v-model="product.base_product"
            name="base_product"
            class="form-select"
            aria-label="Выберите один из вариантов"
          >
            <option selected disabled value="">Выберите продукт</option>
            <option
              v-for="(product, index) in base_products"
              :key="index"
              v-bind:value="product.id"
            >
              {{ product }}
            </option>
          </Field>
          <label>Продукт</label>
          <ErrorMessage as="div" name="base_product" class="alert alert-danger p-1" />
        </div>
        <button type="button" class="btn btn-success">+</button>
      </div>

      <div class="form-floating">
        <Field
          as="select"
          v-model="product.state"
          name="product_state"
          class="form-select"
          aria-label="Выберите один из вариантов"
        >
          <option selected disabled value="">Укажите статус</option>
          <option v-for="(state, index) in product_states" :key="index" v-bind:value="state">
            {{ state }}
          </option>
        </Field>
        <label>Статус</label>
        <ErrorMessage as="div" name="product_state" class="alert alert-danger p-1" />
      </div>

      <div class="row">
        <div class="col">
          <div class="form-floating">
            <Field
              v-focus
              v-model="product.amount"
              name="amount"
              type="number"
              class="form-control"
              placeholder="Количество"
            />
            <label>Количество</label>
            <ErrorMessage as="div" name="amount" class="alert alert-danger p-1" />
          </div>
        </div>

        <div class="col">
          <div class="form-floating">
            <Field
              v-focus
              v-model="product.price_final"
              name="price_final"
              type="number"
              class="form-control"
              placeholder="Цена"
            />
            <label>Цена</label>
            <ErrorMessage as="div" name="price_final" class="alert alert-danger p-1" />
          </div>
        </div>
        <div class="col">
          <div class="form-floating">
            <Field
              :modelValue="product.amount * product.price_final"
              name="cost"
              type="number"
              class="form-control-plaintext"
              placeholder="Итоговая стоимость"
              readonly
            ></Field>
            <label>Итоговая стоимость</label>
          </div>
        </div>
      </div>
      <div class="form-floating">
        <Field
          as="textarea"
          v-model="product.description"
          name="description"
          class="form-control"
          placeholder="Описание"
        ></Field>
        <label>Описание</label>
        <ErrorMessage as="div" name="description" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="product.market"
          name="market"
          type="text"
          class="form-control"
          placeholder="Магазин"
        />
        <label>Где купить?</label>
        <ErrorMessage as="div" name="market" class="alert alert-danger p-1" />
      </div>
    </fieldset>
  </VForm>
</template>

<script>
import * as yup from 'yup'
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { get_base_products } from '@/utils/api_event_management'

export default {
  name: 'event-product-form',
  components: { VForm, Field, ErrorMessage },
  setup() {
    const schema = yup.object({})
    const eventMemberStore = useEventMemberStore()
    return { schema, eventMemberStore }
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
      categories: [],
      types: [],
      units: []
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
    }
  },
  mounted() {
    this.getBaseProducts()
  }
}
</script>
