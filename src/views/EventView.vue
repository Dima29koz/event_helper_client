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

    <component
      :is="currentTabComponent"
      :data="currentTabData"
      class="tab"
      @delEvent="del_event"
      @editEvent="edit_event"
      @editLocation="edit_location"
      @addMember="add_member"
      @joinEvent="join_event"
      @editMember="edit_member"
      @delMember="del_member"
    ></component>
  </div>
</template>

<script>
import { setupIO } from '@/utils/event-socket'
import TabAbout from '@/components/EventTabs/TabAbout.vue'
import TabMembers from '@/components/EventTabs/TabMembers.vue'
import TabProducts from '@/components/EventTabs/TabProducts.vue'
import TabResults from '@/components/EventTabs/TabResults.vue'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore }
  },
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
    del_member(member) {
      this.socket.emit('delete_member', {
        auth: {
          csrf_access_token: this.$cookies.get('csrf_access_token')
        },
        member_id: member.id
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
  }
}
</script>
