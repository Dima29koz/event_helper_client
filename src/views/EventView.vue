<template>
  <div>
    <v-tabs v-model="currentTab" background-color="transparent">
      <v-tab @click="currentTab = 'about'" value="about"> О событии </v-tab>
      <v-tab @click="currentTab = 'products'" value="products"> Продукты </v-tab>
      <v-tab @click="currentTab = 'members'" value="members"> Люди </v-tab>
      <v-tab @click="currentTab = 'results'" value="results"> Итоги </v-tab>
    </v-tabs>

    <keep-alive>
      <component
        :is="currentTabComponent"
        :data="currentTabData"
        class="tab"
        @getMembers="get_members"
        @getEventProducts="get_event_products"
        @delEvent="del_event"
        @editEvent="edit_event"
        @editLocation="edit_location"
        @addMember="add_member"
        @joinEvent="join_event"
        @editMember="edit_member"
        @editMe="edit_me"
        @delMe="del_me"
        @delMember="del_member"
        @addEventProducts="add_event_products"
        @editEventProduct="edit_event_product"
        @deleteEventProduct="delete_event_product"
        @setMemberMoney="set_member_money"
      ></component>
    </keep-alive>
  </div>
</template>

<script>
import { setupIO } from '@/utils/event-socket'
import TabAbout from '@/components/EventTabs/TabAbout.vue'
import TabMembers from '@/components/EventTabs/TabMembers.vue'
import TabProducts from '@/components/EventTabs/TabProducts.vue'
import TabResults from '@/components/EventTabs/TabResults.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { useEventStore } from '../stores/eventStore'
import { useNotificationsStore } from '../stores/notificationsStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    const eventMemberStore = useEventMemberStore()
    const eventStore = useEventStore()
    const notificationsStore = useNotificationsStore()
    return { eventMemberStore, currentUserStore, eventStore, notificationsStore }
  },
  data() {
    return {
      socket: null,
      currentTab: 'about',
      event_data: {},
      event_products: []
    }
  },
  components: { TabAbout, TabMembers, TabProducts, TabResults },
  methods: {
    connect() {
      this.socket.connect()
    },

    disconnect() {
      this.socket.disconnect()
    },

    get_data() {
      this.socket.emit('get_data', { entity: 'event' })
    },

    get_location() {
      this.socket.emit('get_data', { entity: 'location' })
    },

    get_members() {
      this.socket.emit('get_data', { entity: 'members' })
    },

    get_event_products() {
      if (this.event_products.length === 0) {
        this.socket.emit('get_data', { entity: 'products' })
      }
    },

    del_event() {
      this.socket.emit('delete_event', {})
    },

    edit_event(event_data) {
      this.socket.emit('update_data', { entity: 'event', data: event_data })
    },

    edit_location(location_data) {
      this.socket.emit('update_data', { entity: 'location', data: location_data })
    },

    add_member(member_data) {
      this.socket.emit('add_member', { member: member_data })
    },

    join_event(member_data) {
      this.socket.emit('join_event', { member: member_data })
    },

    edit_member(member_data) {
      this.socket.emit('update_data', { entity: 'member', data: member_data })
    },

    edit_me(member_data) {
      this.socket.emit('update_me', { data: member_data })
    },

    del_me() {
      this.socket.emit('delete_me', {})
    },

    del_member(member) {
      this.socket.emit('delete_member', { member_id: member.id })
    },

    add_event_products(products) {
      this.socket.emit('add_products', { products: products })
    },

    edit_event_product(product) {
      this.socket.emit('update_data', { entity: 'product', data: product })
    },

    delete_event_product(product_id) {
      this.socket.emit('delete_event_product', { product_id: product_id })
    },

    set_member_money(member_data) {
      this.socket.emit('set_member_money', { data: member_data })
    }
  },
  computed: {
    currentTabComponent() {
      return 'tab-' + this.currentTab
    },
    currentTabData() {
      if (this.currentTab === 'about') {
        return this.event_data
      }
      if (this.currentTab === 'products') {
        return this.event_products
      }
      if (this.currentTab === 'results') {
        return {
          event_data: this.event_data,
          event_products: this.event_products
        }
      }
      return null
    }
  },

  unmounted() {
    this.disconnect()
  },

  async mounted() {
    let event_key = this.$route.params.key
    try {
      await this.eventMemberStore.fetchMemberInfo(event_key)
    } catch (e) {
      if (
        e.response.status == 400 &&
        'msg' in e.response.data &&
        e.response.data.msg == 'Wrong event key'
      ) {
        this.$router.push({ name: 'events' })
        this.notificationsStore.addNotification('Событие не найдено', 'error')
      }
    }
    this.socket = setupIO(event_key)
    this.eventStore.reset()
    this.get_data()
    this.get_location()

    this.socket.on('connect', () => {
      setTimeout(
        () => {
          this.disconnect()
          this.connect()
        },
        1000 * 60 * 30
      )
    })

    this.socket.on('message', (msg) => {
      console.log(msg)
    })

    this.socket.on('error', (error) => {
      console.log(error)
    })

    this.socket.on('get_event', (event_data) => {
      this.event_data = event_data
      this.event_data.date_start = new Date(event_data.date_start)
      this.event_data.date_end = new Date(event_data.date_end)
      this.eventMemberStore.setEvent(this.event_data)
    })

    this.socket.on('get_event_location', (location_data) => {
      this.event_data.location = location_data
    })

    this.socket.on('get_event_members', (event_members) => {
      this.eventStore.setMembers(event_members)
    })

    this.socket.on('get_event_products', (event_products) => {
      this.event_products = event_products
    })

    this.socket.on('update_event', (event_data) => {
      Object.keys(event_data).forEach((key) => {
        this.event_data[key] = event_data[key]
      })
      this.event_data.date_start = new Date(event_data.date_start)
      this.event_data.date_end = new Date(event_data.date_end)
    })

    this.socket.on('update_event_location', (event_location) => {
      this.event_data.location = event_location
    })

    this.socket.on('update_event_member', (member_data) => {
      if (member_data.user === this.currentUserStore.username) {
        this.eventMemberStore.fetchMemberInfo(event_key)
      }
      this.eventStore.updateMember(member_data)
    })

    this.socket.on('delete_event', (event_data) => {
      console.log(event_data)
      this.$router.push({ name: 'events' })
    })

    this.socket.on('add_member', (member_data) => {
      this.eventStore.addMember(member_data)
    })

    this.socket.on('delete_member', (response) => {
      this.eventStore.deleteMember(response.member_id)
    })

    this.socket.on('add_products', (products) => {
      products.forEach((product) => this.event_products.push(product))
    })

    this.socket.on('add_product', (product) => {
      this.event_products.push(product)
    })

    this.socket.on('update_event_products', (products) => {
      products.forEach((product) => {
        let index = this.event_products.findIndex((p) => p.id === product.id)
        if (index !== -1) {
          this.event_products[index] = product
        }
      })
    })

    this.socket.on('update_event_product', (product) => {
      let index = this.event_products.findIndex((p) => p.id === product.id)
      if (index !== -1) {
        this.event_products[index] = product
      }
    })

    this.socket.on('delete_event_product', (response) => {
      this.event_products = this.event_products.filter((p) => p.id !== response.product_id)
    })
  }
}
</script>
