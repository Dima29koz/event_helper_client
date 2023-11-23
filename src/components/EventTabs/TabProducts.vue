<template>
  <div class="pa-4">
    <v-data-table
      :headers="tableHeaders"
      :items="filteredProducts"
      :items-per-page="-1"
      :group-by="groupBy"
      :search="search"
      no-data-text="Продукты не найдены"
      hover
      class="pa-2"
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Найти..."
          single-line
          hide-details
        >
          <template v-slot:append v-if="canEdit">
            <v-btn @click="dialogCart = true" variant="tonal" color="success" class="h-100">
              <v-icon size="x-large">mdi-cart-variant</v-icon>
            </v-btn>
            <products-options-card></products-options-card>
          </template>
        </v-text-field>
        <div class="mt-2">
          <v-select
            v-model="productFilter.state"
            :items="states"
            item-title="title"
            item-value="key"
            label="Статус"
            multiple
            class="w-25"
          >
            <template v-slot:prepend-item>
              <v-list-item title="Выбрать все" @click="selectAllStates">
                <template v-slot:prepend>
                  <v-checkbox-btn :model-value="isSelectedAllStates"></v-checkbox-btn>
                </template>
              </v-list-item>

              <v-divider class="mt-2"></v-divider>
            </template>
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span>{{ item.title }}</span>
              </v-chip>
              <span v-if="index === 2" class="text-grey text-caption align-self-center">
                (+{{ productFilter.state.length - 2 }})
              </span>
            </template>
          </v-select>
        </div>
      </template>

      <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td :colspan="columns.length" class="pa-0">
            <v-btn
              v-if="item.depth === 0"
              @click="toggleGroup(item)"
              block
              rounded="0"
              variant="text"
              class="justify-start h-100 text-none font-weight-medium text-h6"
              :prepend-icon="isGroupOpen(item) ? '$expand' : '$next'"
            >
              {{ item.value }}
            </v-btn>

            <div v-else class="text-left ps-4 text-subtitle-1">
              {{ getSubGroup(toggleGroup, isGroupOpen, item) }}
            </div>
          </td>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <product-table-row
          :product_data="item"
          :states="states"
          :can_edit="canEdit"
          :can_delete="canDelete"
          @editRow="(product_data, old_data) => editEventProduct(product_data, old_data)"
          @onModalEdit="modalEdit(item)"
          @onDelete="this.$emit('deleteEventProduct', item.id)"
        ></product-table-row>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>

    <v-dialog v-model="dialogVisible" width="1000" :fullscreen="$vuetify.display.mobile">
      <v-card>
        <v-card-title>
          <span class="text-h5">Изменение продукта</span>
        </v-card-title>
        <v-card-text>
          <event-product-form
            id="eventProductForm"
            :product_data="sellectedProduct"
            :states="states"
            :is_editable="canEdit"
            :onSubmit="onEditEventProduct"
          ></event-product-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="eventProductForm" color="blue-darken-1" variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCart" fullscreen>
      <v-card>
        <v-toolbar dark>
          <v-btn icon @click="dialogCart = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Корзина</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn variant="text" @click="$refs.cart.addProducts(), (dialogCart = false)">
              Сохранить
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <cart-products
          ref="cart"
          :data="data"
          @getEventProducts="this.$emit('getEventProducts')"
          @addEventProducts="(data) => this.$emit('addEventProducts', data)"
        ></cart-products>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventProductForm from '@/components/Forms/EventProductForm.vue'
import ProductTableRow from '@/components/EventTabs/ProductTableRow.vue'
import CartProducts from '@/components/EventTabs/CartProducts.vue'
import ProductsOptionsCard from '@/components/Cards/ProductsOptionsCard.vue'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { useEventStore } from '../../stores/eventStore'

export default {
  name: 'tab-products',
  components: { EventProductForm, ProductTableRow, CartProducts, ProductsOptionsCard },
  setup() {
    const eventMemberStore = useEventMemberStore()
    const eventStore = useEventStore()
    return { eventMemberStore, eventStore }
  },
  data() {
    return {
      dialogVisible: false,
      dialogCart: false,
      sellectedProduct: null,
      search: '',
      productFilter: {
        state: []
      },
      groupBy: [
        { key: 'base_product.category.name', order: 'asc' },
        { key: 'base_product.type.name', order: 'asc' }
      ],
      headers: [
        { title: 'Статус', key: 'data-table-group', value: 'data-table-group', sortable: false },
        { title: 'Название', key: 'base_product.name' },
        { title: 'Количество', key: 'amount', align: 'center' },
        {
          title: 'Цена',
          key: 'price',
          align: 'center',
          sortable: false,
          children: [
            { title: 'Ожидаемая', key: 'base_product.price_supposed' },
            { title: 'Итоговая', key: 'price_final' }
          ]
        },
        {
          title: 'Сумма',
          key: 'sum',
          align: 'center',
          sortable: false,
          children: [
            { title: 'Ожидаемая', key: 'sum_supposed' },
            { title: 'Итоговая', key: 'sum_final' }
          ]
        },
        { title: 'Магазин', key: 'market' },
        { title: 'Описание', key: 'description' },
        { title: 'Действия', key: 'actions' }
      ],
      states: [
        { title: 'Не добавлен', key: 'not_added' },
        { title: 'Добавлен', key: 'added' },
        { title: 'В корзине', key: 'in_cart' },
        { title: 'Куплен', key: 'bought' }
      ]
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onEditEventProduct(product_data) {
      this.dialogVisible = false
      const product = { ...product_data, product_id: product_data.base_product.id }
      delete product.base_product
      this.editEventProduct(product, this.sellectedProduct)
    },

    editEventProduct(product_data, old_product_data) {
      if (product_data.state !== undefined && product_data?.state !== old_product_data.state) {
        if (product_data?.state === 'bought') {
          product_data.buyer_id =
            product_data.buyer_id !== undefined
              ? product_data.buyer_id
              : this.eventStore.selected_buyer?.id
        } else {
          product_data.buyer_id = null
        }
      }

      this.$emit('editEventProduct', product_data)
    },

    modalEdit(product) {
      this.sellectedProduct = product
      this.dialogVisible = true
    },
    getSubGroup(toggleGroupFn, isGroupOpenFn, item) {
      if (!isGroupOpenFn(item)) {
        toggleGroupFn(item)
      }
      return item.value
    },
    selectAllStates() {
      if (this.isSelectedAllStates) {
        this.productFilter.state = []
      } else {
        this.productFilter.state = this.states.slice().map((state) => state.key)
      }
    }
  },
  computed: {
    canEdit() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
    canDelete() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
    tableHeaders() {
      if (!this.canEdit && !this.canDelete) {
        return this.headers.slice(0, -1)
      }
      return this.headers
    },

    isSelectedAllStates() {
      return this.productFilter.state.length === this.states.length
    },
    filteredProducts() {
      return this.data.filter((product) => {
        if (!this.productFilter.state.length) {
          return true
        }
        return this.productFilter.state.includes(product.state)
      })
    }
  },
  mounted() {
    this.$emit('getEventProducts')
    this.$emit('getMembers')
  }
}
</script>
