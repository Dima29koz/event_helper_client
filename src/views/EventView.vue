<template>
  <div>
    <button @click="get_location">get location</button>
    <button @click="get_members">get members</button>
    <!-- <event-form></event-form> -->
    <div>{{ event.data }}</div>
    <div>{{ event.location }}</div>
    <div>{{ event.members }}</div>
  </div>
</template>

<script>
import { setupIO } from '@/utils/event-socket'
import EventForm from '@/components/Forms/EventForm.vue'

export default {
  data() {
    return {
      socket: null,
      event: {
        data: {},
        location: {},
        members: {}
      }
    }
  },
  components: { EventForm },
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

  mounted() {
    this.socket = setupIO(this.$route.params.key)
    this.get_data()

    this.socket.on('message', (msg) => {
      console.log(msg)
    })

    this.socket.on('error', (error) => {
      console.log(error)
    })

    this.socket.on('get_event', (event_data) => {
      console.log(event_data)
      this.event.data = event_data
    })

    this.socket.on('get_event_location', (location_data) => {
      console.log(location_data)
      this.event.location = location_data
    })

    this.socket.on('get_event_members', (event_members) => {
      console.log(event_members)
      this.event.members = event_members
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
