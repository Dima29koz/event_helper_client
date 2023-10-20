<template>
  <v-container>
    <v-data-table :headers="headers" :items="events" :items-per-page="-1" hover>
      <template v-slot:top>
        <div class="d-flex justify-space-between">
          <h1>События</h1>
          <div class="hidden-sm-and-up">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
              </template>
              <v-list>
                <v-list-item title="Присоединиться" @click="joinDialogVisible = true"></v-list-item>
                <v-list-item title="Создать" class="text-success" @click="onCreateEvent">
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div class="hidden-xs">
            <v-btn type="button" color="primary" class="me-2" @click="joinDialogVisible = true">
              Присоединиться
            </v-btn>
            <v-btn type="button" color="success" @click="onCreateEvent">Создать</v-btn>
          </div>
        </div>
      </template>

      <template v-slot:item="{ item, index }">
        <tr @click="eventInfo(item)">
          <td>{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ formatedDate(item.date_start, item.date_tz) }}</td>
          <td>{{ formatedDate(item.date_end, item.date_tz) }}</td>
          <td>{{ item.role }}</td>
        </tr>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>

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
import { formatedDate } from '@/utils/formatters'

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
      events_member: [],
      headers: [
        { title: '#', key: '#', sortable: false },
        { title: 'Название', key: 'title' },
        { title: 'Дата начала', key: 'date_start' },
        { title: 'Дата окончания', key: 'date_end' },
        { title: 'Роль', key: 'role' }
      ]
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
