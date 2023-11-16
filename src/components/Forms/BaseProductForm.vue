<template>
  <v-form ref="form" @submit.prevent="submit" :disabled="!is_editable">
    <v-text-field
      v-model.trim="base_product.name"
      counter="50"
      :rules="[(v) => validateField(v, schema.name)]"
      label="Название"
      type="text"
    ></v-text-field>

    <v-editable-autocomplete
      v-model:model="base_product.category"
      :items="categories"
      :rules="[(v) => validateField(v, schema.category)]"
      :max_len="50"
      :label="'Категория'"
      :onAdd="addNewCategory"
    ></v-editable-autocomplete>

    <v-editable-autocomplete
      v-model:model="base_product.type"
      :items="filteredTypes"
      :rules="[(v) => validateField(v, schema.type)]"
      :newItemRules="[() => schema.new_type(base_product.category)]"
      :max_len="50"
      :label="'Тип'"
      :onAdd="addNewType"
    ></v-editable-autocomplete>

    <v-editable-autocomplete
      v-model:model="base_product.unit"
      :items="units"
      :rules="[(v) => validateField(v, schema.unit)]"
      :max_len="50"
      :label="'Единица измерения'"
      :onAdd="addNewUnit"
    ></v-editable-autocomplete>

    <v-text-field
      v-model.number="base_product.price_supposed"
      :rules="[(v) => validateField(v, schema.price_supposed)]"
      label="Примерная стоимость"
      type="number"
    ></v-text-field>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField, validateMonetary } from '../../utils/validators'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import {
  get_product_categories,
  get_product_types,
  get_product_units,
  add_product_category,
  add_product_type,
  add_product_unit
} from '@/utils/api_event_management'

export default {
  name: 'base-product-form',
  setup() {
    const schema = {
      name: yup
        .string()
        .max(50, 'Превышена максимальная длина')
        .required('Название не указано')
        .matches(/^[^\d].*$/, 'Название не может начинаться с числа'),
      category: yup.object().required('Категория не выбрана'),
      type: yup.object().required('Тип не выбран'),
      new_type: (category) => (category !== null ? true : 'Категория не выбрана'),
      unit: yup.object().required('Единица измерения не выбрана'),
      price_supposed: validateMonetary
    }
    const eventMemberStore = useEventMemberStore()
    return { schema, eventMemberStore, validateField }
  },
  data() {
    return {
      base_product: this.base_product_data
        ? { ...this.base_product_data }
        : {
            name: '',
            category: null,
            type: null,
            unit: null,
            price_supposed: 0
          },
      categories: [],
      types: [],
      units: [],
      searchValue: ''
    }
  },
  props: {
    base_product_data: {},
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
    async getBaseProductOptions() {
      this.categories = await get_product_categories()
      this.types = await get_product_types()
      this.units = await get_product_units()
    },
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.onSubmit(this.base_product)
      }
    },
    async addNewCategory(name) {
      let res = await add_product_category(name)
      this.categories.push(res)
    },
    async addNewType(name) {
      const category_id = this.base_product.category.id
      let res = await add_product_type(name, category_id)
      this.types.push(res)
    },
    async addNewUnit(name) {
      let res = await add_product_unit(name)
      this.units.push(res)
    }
  },

  watch: {
    'base_product.category'() {
      this.base_product.type = null
    },

    'base_product.type'(newVal) {
      if (newVal) {
        this.base_product.category = this.categories.find(
          (category) => category.id === newVal.category
        )
      }
    }
  },

  computed: {
    filteredTypes() {
      if (!this.base_product.category) {
        return this.types
      }
      return this.types.filter((type) => type.category === this.base_product.category.id)
    }
  },

  mounted() {
    this.getBaseProductOptions()
  }
}
</script>
