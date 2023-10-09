<template>
  <v-container>
    <v-table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-space-between">
          <h1>События</h1>
          <div>
            <v-btn type="button" color="primary" class="me-2" @click="joinDialogVisible = true">
              Присоединиться
            </v-btn>
            <v-btn type="button" color="success" @click="onCreateEvent">Создать</v-btn>
          </div>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" class="text-center">Название</th>
          <th scope="col" class="text-center">Дата начала</th>
          <th scope="col" class="text-center">Дата окончания</th>
          <th scope="col" class="text-center">Роль</th>
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
    </v-table>

    <v-dialog v-model="joinDialogVisible">
      <v-card>
        <v-card-title>
          <span class="text-h5">Присоединиться</span>
        </v-card-title>
        <v-card-text>
          <event-join-form id="eventJoinForm" :onSubmit="joinEvent"></event-join-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="joinDialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="eventJoinForm" color="blue-darken-1" variant="text"
            >Присоединиться
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogVisible">
      <v-card>
        <v-card-title>
          <span class="text-h5">Создание события</span>
        </v-card-title>
        <v-card-text>
          <event-creation-form id="eventForm" :onSubmit="addEvent"></event-creation-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="eventForm" color="blue-darken-1" variant="text"
            >Создать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
      this.dialogVisible = false
      let key = await create_event(new_event)
      this.$router.push({ name: 'event', params: { key: key } })
    },

    eventInfo(event) {
      this.$router.push({ name: 'event', params: { key: event.key } })
    },

    joinEvent(key) {
      this.joinDialogVisible = false
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
