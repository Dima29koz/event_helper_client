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
          <th scope="col">Дата начала</th>
          <th scope="col">Дата окончания</th>
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
          <td>{{ formatedDate(event.date_start, event.date_tz) }}</td>
          <td>{{ formatedDate(event.date_end, event.date_tz) }}</td>

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
        <event-creation-form id="eventForm" :onSubmit="addEvent"></event-creation-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="eventForm">Создать</button>
      </template>
    </b-modal>
  </div>
</template>

<script setup>
import { formatedDate } from '@/utils/time'
</script>

<script>
import EventCreationForm from '../components/Forms/EventCreationForm.vue'
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
    EventCreationForm
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
      this.$refs.modalElem.modal.hide()
      let key = await create_event(new_event)
      this.$router.push({ name: 'event', params: { key: key } })
    },

    eventInfo(event) {
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
