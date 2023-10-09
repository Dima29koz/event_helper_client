<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h1>Продукты:</h1>
      <v-btn
        v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
        @click="(sellectedProductIdx = NaN), (dialogVisible = true)"
        color="success"
        icon="mdi-plus"
      ></v-btn>
    </div>
    <v-table class="table table-hover caption-top">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Статус</th>
          <th scope="col">количество</th>
          <th scope="col">цена предполагаемая</th>
          <th scope="col">цена</th>
          <th scope="col">сумма предполагаемая</th>
          <th scope="col">сумма</th>
          <th scope="col">где купить</th>
          <th scope="col">комментарий</th>
          <th v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])" scope="col">
            Удалить
          </th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <!-- <tr>
          <td colspan="11">
            <button class="btn btn-outline-success" name="add_product">+</button>
          </td>
        </tr> -->
        <tr v-for="(product, index) in data" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ product.base_product.name }}</td>
          <td>{{ product.state }}</td>
          <td>{{ product.amount }}</td>
          <td>{{ product.base_product.price_supposed }}</td>
          <td>{{ product.price_final }}</td>
          <td>{{ product.base_product.price_supposed * product.amount }}</td>
          <td>{{ product.price_final * product.amount }}</td>
          <td>{{ product.market }}</td>
          <td>{{ product.description }}</td>
          <td v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])">
            <v-btn name="delete-product" icon="mdi-trash-can-outline" color="red"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialogVisible" width="1000">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <event-product-form
            id="eventProductForm"
            :product_data="sellectedProduct"
            :is_editable="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
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
  </v-container>
</template>

<script>
import EventProductForm from '@/components/Forms/EventProductForm.vue'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-products',
  components: { EventProductForm },
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore }
  },
  data() {
    return {
      dialogVisible: false,
      sellectedProductIdx: NaN
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
      this.$refs.modalElem.modal.hide()
      this.$emit('addEventProduct', product_data)
    },
    onEditEventProduct(product_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('editEventProduct', product_data)
    }
  },
  computed: {
    sellectedProduct() {
      if (isNaN(this.sellectedProductIdx)) {
        return null
      }
      return this.data[this.sellectedProductIdx]
    },
    dialogTitle() {
      if (isNaN(this.sellectedProductIdx)) {
        return 'Добавление продукта'
      }
      return 'Изменение продукта'
    },
    dialogOnSubmit() {
      if (isNaN(this.sellectedProductIdx)) {
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
