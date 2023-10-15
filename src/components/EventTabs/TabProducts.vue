<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      :items-per-page="-1"
      :group-by="groupBy"
      :search="search"
      hover
    >
      <template v-slot:top>
        <div class="d-flex justify-space-between">
          <h1>Продукты:</h1>
          <div>
            <v-btn
              v-if="canEdit"
              @click="(sellectedProduct = null), (dialogVisible = true)"
              color="success"
              icon="mdi-plus"
            ></v-btn>
            <v-btn
              v-if="canEdit"
              @click="dialogCart = true"
              color="success"
              icon="mdi-cart-variant"
            ></v-btn>
          </div>
        </div>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Найти..."
          single-line
          hide-details
        ></v-text-field>
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
        <product-table-row
          :product_data="item"
          :states="states"
          :can_edit="canEdit"
          :can_delete="canDelete"
          @editRow="(product_data) => this.$emit('editEventProduct', product_data)"
          @onModalEdit="modalEdit(item)"
        ></product-table-row>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>

    <v-dialog v-model="dialogVisible" width="1000">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <event-product-form
            id="eventProductForm"
            :product_data="sellectedProduct"
            :states="states"
            :is_editable="canEdit"
            :onSubmit="dialogOnSubmit"
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
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-products',
  components: { EventProductForm, ProductTableRow, CartProducts },
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore }
  },
  data() {
    return {
      dialogVisible: false,
      dialogCart: false,
      sellectedProduct: null,
      search: '',
      groupBy: [{ key: 'base_product.category', order: 'asc' }],
      headers: [
        [
          { title: 'Название', key: 'base_product.name', rowspan: 2 },
          { title: 'Количество', key: 'amount', align: 'center', rowspan: 2 },
          { title: 'Цена', key: 'price', colspan: 2, align: 'center', sortable: false },
          { title: 'Сумма', key: 'sum', colspan: 2, align: 'center', sortable: false },
          { title: 'Магазин', key: 'market', rowspan: 2 },
          { title: 'Описание', key: 'description', rowspan: 2 },
          { title: 'Действия', key: 'actions', rowspan: 2 }
        ],
        [
          { title: 'Предполагаемая', key: 'base_product.price_supposed' },
          { title: 'Итоговая', key: 'price_final' },
          { title: 'Предполагаемая', key: 'sum_supposed' },
          { title: 'Итоговая', key: 'sum_final' }
        ]
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
    onAddEventProduct(product_data) {
      this.dialogVisible = false
      this.$emit('addEventProduct', product_data)
    },
    onEditEventProduct(product_data) {
      this.dialogVisible = false
      const product = { ...product_data, product_id: product_data.base_product.id }
      delete product.base_product
      this.$emit('editEventProduct', product)
    },
    modalEdit(product) {
      this.sellectedProduct = product
      this.dialogVisible = true
    }
  },
  computed: {
    canEdit() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
    canDelete() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
    dialogTitle() {
      if (this.sellectedProduct === null) {
        return 'Добавление продукта'
      }
      return 'Изменение продукта'
    },
    dialogOnSubmit() {
      if (this.sellectedProduct === null) {
        return this.onAddEventProduct
      }
      return this.onEditEventProduct
    }
  },
  mounted() {
    this.$emit('getEventProducts')
  }
}
</script>
