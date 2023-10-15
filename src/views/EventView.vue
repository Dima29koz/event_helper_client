<template>
  <div>
    <v-tabs v-model="currentTab" background-color="transparent">
      <v-tab @click="currentTab = 'about'" value="about"> Информация о событии </v-tab>
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
        @addEventProduct="add_event_product"
        @addEventProducts="add_event_products"
        @editEventProduct="edit_event_product"
        @deleteEventProduct="delete_event_product"
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

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore, currentUserStore }
  },
  data() {
    return {
      socket: null,
      currentTab: 'about',
      event_data: {},
      event_members: [],
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
      this.socket.emit('get_data', {
        entity: 'event'
      })
    },
    get_location() {
      this.socket.emit('get_data', {
        entity: 'location'
      })
    },
    get_members() {
      this.socket.emit('get_data', {
        entity: 'members'
      })
    },
    get_event_products() {
      if (this.event_products.length === 0) {
        this.socket.emit('get_data', {
          entity: 'products'
        })
      }
    },
    del_event() {
      this.socket.emit('delete_event', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        }
      })
    },
    edit_event(event_data) {
      this.socket.emit('update_data', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        entity: 'event',
        data: event_data
      })
    },
    edit_location(location_data) {
      this.socket.emit('update_data', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        entity: 'location',
        data: location_data
      })
    },
    add_member(member_data) {
      this.socket.emit('add_member', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        member: member_data
      })
    },
    join_event(member_data) {
      this.socket.emit('join_event', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        member: member_data
      })
    },
    edit_member(member_data) {
      this.socket.emit('update_data', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        entity: 'member',
        data: member_data
      })
    },
    edit_me(member_data) {
      this.socket.emit('update_me', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        data: member_data
      })
    },
    del_me() {
      this.socket.emit('delete_me', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        }
      })
    },
    del_member(member) {
      this.socket.emit('delete_member', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        member_id: member.id
      })
    },
    add_event_product(product) {
      this.socket.emit('add_product', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        product: product
      })
    },
    add_event_products(products) {
      let fixed_products = products.map((product) => {
        return { ...product, product_id: product.id }
      })
      fixed_products.forEach((product) => {
        delete product.id
      })
      this.socket.emit('add_products', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        products: fixed_products
      })
    },
    edit_event_product(product) {
      this.socket.emit('update_data', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        entity: 'product',
        data: product
      })
    },
    delete_event_product(product_id) {
      this.socket.emit('delete_event_product', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        product_id: product_id
      })
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
      if (this.currentTab === 'members') {
        return this.event_members
      }
      if (this.currentTab === 'products') {
        return this.event_products
      }
      return null
    }
  },

  mounted() {
    let event_key = this.$route.params.key
    this.socket = setupIO(event_key)
    this.get_data()
    this.get_location()
    this.eventMemberStore.fetchMemberInfo(event_key)

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
    })

    this.socket.on('get_event_location', (location_data) => {
      this.event_data.location = location_data
    })

    this.socket.on('get_event_members', (event_members) => {
      event_members.forEach((member) => {
        if (member.date_from) {
          member.date_from = new Date(member.date_from)
        }
        if (member.date_to) {
          member.date_to = new Date(member.date_to)
        }
      })
      this.event_members = event_members
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
      let member_idx = this.event_members.findIndex((element) => element.id == member_data.id)
      const me_idx = this.event_members.findIndex((e) => e.user === this.currentUserStore.username)
      if (member_idx == me_idx && me_idx > -1) {
        this.eventMemberStore.fetchMemberInfo(event_key)
      }

      if (member_data.date_from) {
        member_data.date_from = new Date(member_data.date_from)
      }
      if (member_data.date_to) {
        member_data.date_to = new Date(member_data.date_to)
      }
      this.event_members[member_idx] = member_data
    })
    this.socket.on('delete_event', (event_data) => {
      console.log(event_data)
      this.$router.push({ name: 'events' })
    })
    this.socket.on('add_member', (member_data) => {
      if (member_data.date_from) {
        member_data.date_from = new Date(member_data.date_from)
      }
      if (member_data.date_to) {
        member_data.date_to = new Date(member_data.date_to)
      }
      this.event_members.push(member_data)
    })
    this.socket.on('delete_member', (response) => {
      this.event_members = this.event_members.filter((member) => member.id !== response.member_id)
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
