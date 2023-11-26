<template>
  <tr>
    <td>
      <template v-if="can_edit">
        <div class="d-flex align-center justify-space-between">
          <v-btn
            @click="setPrevState()"
            :disabled="stateIdx === 0"
            density="compact"
            name="edit-product"
            variant="plain"
            icon
          >
            <v-icon icon="mdi-chevron-left"></v-icon>
          </v-btn>

          <v-menu location="center">
            <template v-slot:activator="{ props }">
              <v-chip v-bind="props" label class="flex-1-1-100 justify-center">
                {{ getStateTitle() }}
              </v-chip>
            </template>
            <v-list
              :items="states"
              item-value="key"
              @click:select="(e) => setState(e.id)"
              :selected="[product_data.state]"
            ></v-list>
          </v-menu>

          <v-btn
            @click="setNextState()"
            :disabled="stateIdx === states.length - 1"
            density="compact"
            name="edit-product"
            variant="plain"
            icon
          >
            <v-icon icon="mdi-chevron-right"></v-icon>
          </v-btn>
        </div>
      </template>
      <span v-else style="white-space: nowrap !important">
        {{ getStateTitle() }}
      </span>
    </td>
    <td>{{ product_data.base_product.name }}</td>
    <td>
      <template v-if="can_edit">
        <div class="d-flex align-center justify-space-evenly">
          <v-btn
            @click="reduceAmount()"
            density="compact"
            variant="text"
            icon
            :disabled="product_data.amount == 0"
          >
            <v-icon color="green"> mdi-minus </v-icon>
          </v-btn>

          <div class="mx-3" style="white-space: nowrap !important">
            {{ product_data.amount }} {{ product_data.base_product.unit.name }}
          </div>
          <v-btn @click="increaseAmount()" density="compact" variant="text" icon>
            <v-icon color="red"> mdi-plus </v-icon>
          </v-btn>
        </div>
      </template>
      <span v-else style="white-space: nowrap !important">
        {{ product_data.amount }} {{ product_data.base_product.unit.name }}
      </span>
    </td>
    <td class="text-end">{{ getNumberFormat(product_data.price_supposed) }}</td>
    <td class="text-end">
      <v-editable-field
        v-if="can_edit"
        :value="product_data.price_final"
        :formatter="getNumberFormat"
        :type="'number'"
        @submit="(v) => updateProduct({ price_final: Number(v.toFixed(2)) })"
      ></v-editable-field>
      <span v-else>{{ getNumberFormat(product_data.price_final) }}</span>
    </td>
    <td class="text-end">
      {{ getNumberFormat(product_data.price_supposed * product_data.amount) }}
    </td>
    <td class="text-end">
      {{ getNumberFormat(product_data.price_final * product_data.amount) }}
    </td>
    <td>
      <v-editable-field
        v-if="can_edit"
        :value="product_data.market"
        @submit="(v) => updateProduct({ market: v })"
      ></v-editable-field>
      <span v-else>{{ product_data.market }}</span>
    </td>
    <td>
      <span class="d-inline-block text-truncate" style="max-width: 10rem">
        {{ product_data.description }}
        <v-tooltip activator="parent" location="bottom">{{ product_data.description }}</v-tooltip>
      </span>
    </td>
    <td v-if="can_edit || can_delete">
      <div class="d-flex">
        <v-btn
          v-if="can_edit"
          @click="$emit('onModalEdit')"
          density="compact"
          name="edit-product"
          icon
        >
          <v-icon icon="mdi-pencil" color="success"></v-icon>
        </v-btn>
        <v-btn
          v-if="can_delete"
          @click="$emit('onDelete')"
          density="compact"
          name="delete-product"
          icon
        >
          <v-icon icon="mdi-trash-can-outline" color="red"></v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>

<script>
import { getNumberFormat } from '@/utils/formatters'

export default {
  name: 'product-table-row',
  setup() {
    return { getNumberFormat }
  },
  data() {
    return {}
  },
  props: {
    product_data: {},
    states: { default: [] },
    can_edit: { default: false },
    can_delete: { default: false }
  },
  methods: {
    updateProduct(updated) {
      this.$emit(
        'editRow',
        Object.assign(
          {
            id: this.product_data.id
          },
          updated
        ),
        this.product_data
      )
    },
    getStateTitle() {
      return this.states.find((p) => p.key === this.product_data.state).title
    },
    setState(state) {
      if (state !== this.product_data.state) {
        this.updateProduct({ state: state })
      }
    },
    setNextState() {
      const idx = this.stateIdx
      if (idx + 1 < this.states.length) {
        this.setState(this.states[idx + 1].key)
      }
    },
    setPrevState() {
      const idx = this.stateIdx
      if (idx > 0) {
        this.setState(this.states[idx - 1].key)
      }
    },
    increaseAmount() {
      this.updateProduct({ amount: this.product_data.amount + 1 })
    },
    reduceAmount() {
      if (this.product_data.amount > 0) {
        this.updateProduct({ amount: this.product_data.amount - 1 })
      }
    }
  },
  computed: {
    stateIdx() {
      return this.states.findIndex((p) => p.key === this.product_data.state)
    }
  }
}
</script>
