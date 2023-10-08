<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>Продукты:</h1>
          <div>
            <button
              v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
              type="button"
              class="btn btn-success"
              @click="(sellectedProductIdx = NaN), (dialogVisible = true)"
            >
              Добавить
            </button>
          </div>
        </div>
      </caption>
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
            <button class="btn btn-outline-danger" name="delete-product">x</button>
          </td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="dialogVisible"
      :title="dialogTitle"
      :size="'modal-lg'"
      @close="dialogVisible = false"
      ref="modalElem"
    >
      <template #body>
        <event-product-form
          id="eventProductForm"
          :product_data="sellectedProduct"
          :is_editable="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
          :onSubmit="dialogOnSubmit"
        ></event-product-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="eventProductForm">Сохранить</button>
      </template>
    </b-modal>
  </div>
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
