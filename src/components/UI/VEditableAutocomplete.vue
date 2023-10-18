<template>
  <v-autocomplete
    v-model="mValue"
    :items="items"
    :rules="rules"
    item-title="name"
    :label="label"
    auto-select-first
    return-object
    clearable
    @update:search="updateSearchValue"
  >
    <template v-slot:no-data>
      <v-form @submit.prevent ref="form">
        <v-text-field
          v-model="searchValue"
          :rules="[(v) => validateField(v, schema.searchValue)]"
          label="Добавляемое значение"
          type="text"
          readonly
        >
          <template v-slot:append>
            <v-btn @click="onBeforeAdd" icon="mdi-plus" color="success"></v-btn>
          </template>
        </v-text-field>
      </v-form>
    </template>
  </v-autocomplete>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '@/utils/validate_field'

export default {
  name: 'v-editable-autocomplete',
  setup() {
    const schema = {
      searchValue: yup
        .string()
        .required('Значение не указано')
        .matches(/^[^\d].*$/, 'Значение не может начинаться с числа')
    }
    return { schema, validateField }
  },
  data() {
    return {
      searchValue: ''
    }
  },
  props: {
    model: null,
    items: null,
    label: {
      type: String,
      default: ''
    },
    rules: null,
    onAdd: {
      type: Function
    }
  },
  methods: {
    updateSearchValue(value) {
      this.searchValue = value.trim()
    },
    async onBeforeAdd() {
      if ((await this.$refs.form.validate()).valid) {
        this.onAdd(this.searchValue)
      }
    }
  },
  computed: {
    mValue: {
      get() {
        return this.model
      },
      set(newValue) {
        this.$emit('update:model', newValue)
      }
    }
  }
}
</script>
