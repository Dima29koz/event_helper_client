<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="base_products"
      :items-per-page="-1"
      :group-by="groupBy"
      :search="search"
      hover
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Поиск"
          single-line
          hide-details
        >
          <template v-slot:append>
            <v-btn @click="dialogVisible = true" variant="tonal" color="success" class="h-100">
              <v-icon size="x-large">mdi-table-plus</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </template>

      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="columns.length" class="pa-0">
            <v-btn
              @click="toggleGroup(item)"
              block
              rounded="0"
              variant="text"
              class="justify-start h-100 text-none font-weight-medium text-subtitle-1"
              :prepend-icon="isGroupOpen(item) ? '$expand' : '$next'"
            >
              {{ item.value }}
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-checkbox-btn
              :modelValue="item.amount !== item.added_amount"
              @update:modelValue="handleSelection(item)"
            ></v-checkbox-btn>
          </td>
          <td>
            <div class="d-flex align-center justify-space-evenly">
              <v-btn
                @click="reduceAmount(item)"
                density="compact"
                variant="text"
                icon
                :disabled="item.amount == 0"
              >
                <v-icon color="green"> mdi-minus </v-icon>
              </v-btn>

              <div class="mx-3" style="white-space: nowrap !important">
                {{ item.amount + item.bought_amount }} / {{ item.bought_amount }} {{ item.unit }}
              </div>
              <v-btn @click="increaseAmount(item)" density="compact" variant="text" icon>
                <v-icon color="red"> mdi-plus </v-icon>
              </v-btn>
            </div>
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ getNumberFormat(item.price_supposed) }}</td>
          <td>
            {{ getNumberFormat((item.amount + item.bought_amount) * item.price_supposed) }}
          </td>
        </tr>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>

    <v-dialog v-model="dialogVisible" width="1000">
      <v-card>
        <v-card-title>
          <span class="text-h5">Добавление продукта</span>
        </v-card-title>
        <v-card-text>
          <base-product-form
            id="ProductForm"
            :base_product_data="null"
            :is_editable="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
            :onSubmit="onAddBaseProduct"
          ></base-product-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="ProductForm" color="blue-darken-1" variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BaseProductForm from '@/components/Forms/BaseProductForm.vue'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { add_base_product, get_base_products } from '../../utils/api_event_management'
import { getNumberFormat } from '@/utils/formatters'

export default {
  name: 'cart-products',
  components: { BaseProductForm },
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore, getNumberFormat }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      base_products: [],
      dialogVisible: false,
      search: '',
      groupBy: [{ key: 'category', order: 'asc' }],
      headers: [
        { title: 'Количество', key: 'amount', align: 'center' },
        { title: 'Название', key: 'name' },
        { title: 'Тип', key: 'type' },
        { title: 'Цена', key: 'price_supposed' },
        { title: 'Сумма', key: 'sum_supposed' }
      ]
    }
  },
  methods: {
    async onAddBaseProduct(product_data) {
      this.dialogVisible = false
      const product = await add_base_product(product_data)
      this._fixProduct(product, 0, 0, 0)
      this.base_products.push(product)
    },
    async getBaseProducts() {
      const base_products = await get_base_products()
      base_products.forEach((product) => {
        const baseProduct = this.base_products.find((p) => p.id === product.id)
        if (
          baseProduct &&
          'amount' in baseProduct &&
          baseProduct.amount !== baseProduct.added_amount
        ) {
          product.amount = baseProduct.amount
        }
      })
      this.base_products = base_products
      this.resetSelection(true)
    },
    addProducts() {
      this.$emit('addEventProducts', this.selected)
    },
    resetSelection(resetAmount = false) {
      this.base_products.forEach((product) => {
        const event_products = this.data.filter(
          (event_product) => event_product.base_product.id === product.id
        )
        let not_bought = 0
        let bought = 0

        if (event_products.length !== 0) {
          event_products.forEach((event_product) => {
            event_product.state === 'bought'
              ? (bought += event_product.amount)
              : (not_bought += event_product.amount)
          })
        }
        this._fixProduct(product, not_bought, not_bought, bought, resetAmount)
      })
    },
    _fixProduct(product, amount, added_amount, bought_amount, resetAmount = false) {
      if (resetAmount || !('amount' in product)) {
        product.amount = amount
      }
      product.added_amount = added_amount
      product.bought_amount = bought_amount
    },
    increaseAmount(item) {
      item.amount += 1
    },
    reduceAmount(item) {
      if (item.amount > 0) {
        item.amount -= 1
      }
    },
    handleSelection(item) {
      if (item.amount !== item.added_amount) {
        item.amount = item.added_amount
      } else {
        item.amount += 1
      }
    }
  },
  computed: {
    selected() {
      return this.base_products.filter((product) => product.amount != product.added_amount)
    }
  },
  watch: {
    data: {
      handler() {
        this.getBaseProducts()
      },
      deep: true
    }
  },
  async mounted() {
    this.$emit('getEventProducts')
    await this.getBaseProducts()
  }
}
</script>
