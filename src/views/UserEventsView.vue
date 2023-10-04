<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>События</h1>
          <div>
            <button type="button" class="btn btn-primary me-2" @click="joinDialogVisible = true">
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
        <tr v-for="(event, index) in events" :key="index" @click="eventInfo(event)">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ event.title }}</td>
          <td>{{ formatedDate(event.date_start, event.date_tz) }}</td>
          <td>{{ formatedDate(event.date_end, event.date_tz) }}</td>

          <td>{{ event.role }}</td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="joinDialogVisible"
      :title="'Присоединиться'"
      @close="joinDialogVisible = false"
      ref="modalJoin"
    >
      <template #body>
        <event-join-form id="eventJoinForm" :onSubmit="joinEvent"></event-join-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="eventJoinForm">Присоединиться</button>
      </template>
    </b-modal>

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

<script>
import EventCreationForm from '@/components/Forms/EventCreationForm.vue'
import EventJoinForm from '@/components/Forms/EventJoinForm.vue'
import { get_events, create_event } from '@/utils/api_event_management'
import { formatedDate } from '@/utils/time'

export default {
  setup() {
    return { formatedDate }
  },
  data() {
    return {
      dialogVisible: false,
      joinDialogVisible: false,
      selectedEventIdx: NaN,
      events_creator: [],
      events_member: []
    }
  },

  components: {
    EventCreationForm,
    EventJoinForm
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
    },

    joinEvent(key) {
      this.$refs.modalJoin.modal.hide()
      key = key.split('/').at(-1)
      this.$router.push({ name: 'event', params: { key: key } })
    },

    async getEvents() {
      const data = await get_events()
      this.events_creator = data.creator_on
      this.events_member = data.member_on
    }
  },
  computed: {
    events() {
      let joinedEvents = [...this.events_member]
      this.events_creator.forEach((event) => {
        let sameEvent = this.events_member.find((e) => e.key === event.key)
        if (sameEvent) {
          sameEvent.role = sameEvent.role + ', creator'
        } else {
          event.role = 'creator'
          joinedEvents.push(event)
        }
      })
      return joinedEvents
    }
  },

  mounted() {
    this.getEvents()
  }
}
</script>
