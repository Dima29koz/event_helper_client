<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>События</h1>
          <div>
            <button
              type="button"
              class="btn btn-primary me-2"
              @click="$router.push({ name: 'event', params: { key: '123' } })"
            >
              Присоединиться
            </button>
            <button type="button" class="btn btn-success" @click="onCreateEvent">Создать</button>
          </div>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Роль</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr
          v-for="(event, index) in [...events_creator, ...events_member]"
          :key="index"
          @click="eventInfo(event)"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ event.title }}</td>
          <td>{{ event.role ? event.role : 'creator' }}</td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="dialogVisible"
      :title="'Создание события'"
      @close="dialogVisible = false"
      ref="modalElem"
    >
      <template #body>
        <event-form id="eventForm" :onSubmit="addEvent"></event-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="eventForm">Создать</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import EventForm from '../components/Forms/EventForm.vue'
import { get_events, create_event } from '@/utils/api_event_management'

export default {
  data() {
    return {
      dialogVisible: false,
      selectedEventIdx: NaN,
      events_creator: [],
      events_member: []
    }
  },

  components: {
    EventForm
  },

  methods: {
    eventByIdx() {
      if (isNaN(this.selectedEventIdx)) {
        return {}
      }
      return this.events[this.selectedEventIdx]
    },

    onCreateEvent() {
      this.selectedEventIdx = NaN
      this.dialogVisible = true
    },

    async addEvent(new_event) {
      console.log(new_event)
      this.$refs.modalElem.modal.hide()
      let key = await create_event(new_event)
      console.log(key)
      // this.events.push(new_event)
    },

    async eventInfo(event) {
      this.$router.push({ name: 'event', params: { key: event.key } })
      // let event_data = await get_location(event.id);
      // this.selectedEventIdx = index;
      // this.events[index] = event_data;
      // this.dialogVisible = true;
    },

    async getEvents() {
      const data = await get_events()
      this.events_creator = data.creator_on
      this.events_member = data.member_on
    }
  },

  mounted() {
    this.getEvents()
  }
}
</script>
