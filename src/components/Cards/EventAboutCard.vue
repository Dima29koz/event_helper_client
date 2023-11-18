<template>
  <v-card>
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div></div>
        <div class="text-h6 text-md-h5 text-lg-h4 font-weight-bold">{{ event.title }}</div>

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" icon="mdi-dots-vertical"></v-btn>
          </template>
          <v-list>
            <v-list-item
              title="Скопировать ссылку на событие"
              @click="copyLocation"
              append-icon="mdi-content-copy"
            ></v-list-item>
            <v-list-item
              v-if="canEdit"
              title="Изменить"
              @click="this.$emit('editEvent')"
              append-icon="mdi-pencil"
            ></v-list-item>
            <template v-if="canDelete">
              <v-divider></v-divider>
              <v-list-item
                title="Удалить"
                class="text-red"
                @click="deleteEvent"
                append-icon="mdi-trash-can-outline"
              >
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>
    <v-card-subtitle class="text-center text-md-subtitle-2 text-lg-subtitle-1 font-weight-medium">
      {{ formatDateTime(event.date_start, '') }} - {{ formatDateTime(event.date_end, '') }}
    </v-card-subtitle>
    <v-card-text>
      <div v-html="event.description" class="mt-2 tiptap"></div>
    </v-card-text>
    <location-card :location="event.location"></location-card>

    <v-confirm-dialog ref="confirm" />
  </v-card>
</template>

<script>
import LocationCard from '@/components/Cards/LocationCard.vue'
import { formatDateTime } from '@/utils/formatters'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { useNotificationsStore } from '@/stores/notificationsStore'

export default {
  setup() {
    const eventMemberStore = useEventMemberStore()
    const notificationsStore = useNotificationsStore()
    return { formatDateTime, eventMemberStore, notificationsStore }
  },
  name: 'event-about-card',
  components: { LocationCard },
  props: {
    event: {
      type: Object,
      default: function () {
        return {
          title: '',
          description: '',
          date_start: null,
          date_end: null,
          timezone: '+0300',
          cost_reduction_factor: 25,
          location: {}
        }
      }
    }
  },
  methods: {
    async deleteEvent() {
      if (
        await this.$refs.confirm.open(
          'Подтвердите удаление события',
          'Вы уверены что хотите удалить событие?'
        )
      ) {
        this.$emit('delEvent')
      }
    },
    async copyLocation() {
      try {
        await navigator.clipboard.writeText(window.location.href)
        this.notificationsStore.addNotification('Ссылка скопирована', 'info')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
  },
  computed: {
    canEdit() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
    canDelete() {
      return this.eventMemberStore.hasOneOfRoles(['creator'])
    }
  }
}
</script>
