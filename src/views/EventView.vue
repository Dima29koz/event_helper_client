<template>
  <div class="container">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'about' }"
          @click="currentTab = 'about'"
        >
          Информация о событии
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'products' }"
          @click="currentTab = 'products'"
        >
          Продукты
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'members' }"
          @click="(currentTab = 'members'), get_members()"
        >
          Люди
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: currentTab === 'results' }"
          @click="currentTab = 'results'"
        >
          Итоги
        </button>
      </li>
    </ul>

    <component :is="currentTabComponent" :data="currentTabData" class="tab"></component>
  </div>
</template>

<script>
import { setupIO } from '@/utils/event-socket'
import TabAbout from '@/components/EventTabs/TabAbout.vue'
import TabMembers from '@/components/EventTabs/TabMembers.vue'
import TabProducts from '@/components/EventTabs/TabProducts.vue'
import TabResults from '@/components/EventTabs/TabResults.vue'

export default {
  data() {
    return {
      socket: null,
      currentTab: 'about',
      event_data: {},
      event_members: []
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
    }
  },
  computed: {
    currentTabComponent() {
      return 'tab-' + this.currentTab.toLowerCase()
    },
    currentTabData() {
      if (this.currentTab === 'about') {
        return this.event_data
      }
      if (this.currentTab === 'members') {
        return this.event_members
      }
      return null
    }
  },

  mounted() {
    this.socket = setupIO(this.$route.params.key)
    this.get_data()
    this.get_location()

    this.socket.on('message', (msg) => {
      console.log(msg)
    })

    this.socket.on('error', (error) => {
      console.log(error)
    })

    this.socket.on('get_event', (event_data) => {
      console.log(event_data)
      this.event_data = event_data
    })

    this.socket.on('get_event_location', (location_data) => {
      console.log(location_data)
      this.event_data.location = location_data
    })

    this.socket.on('get_event_members', (event_members) => {
      console.log(event_members)
      this.event_members = event_members
    })

    this.socket.on('update_event', (event_data) => {
      console.log(event_data)
    })
    this.socket.on('update_event_location', (event_location) => {
      console.log(event_location)
    })
    this.socket.on('update_event_member', (member_data) => {
      console.log(member_data)
    })
    this.socket.on('delete_event', (event_data) => {
      console.log(event_data)
    })
    this.socket.on('add_member', (member_data) => {
      console.log(member_data)
    })
    this.socket.on('delete_member', (member_id) => {
      console.log(member_id)
    })
  }
}
</script>
