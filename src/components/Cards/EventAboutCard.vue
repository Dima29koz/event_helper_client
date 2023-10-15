<template>
  <v-card class="text-start">
    <v-card-title class="d-flex justify-space-between">
      <div>{{ event.title }}</div>
      <v-menu v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-list>
          <v-list-item title="Изменить" @click="this.$emit('editEvent')"></v-list-item>
          <template v-if="eventMemberStore.hasOneOfRoles(['creator'])">
            <v-divider></v-divider>
            <v-list-item title="Удалить" class="text-red" @click="this.$emit('delEvent')">
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <h5>{{ formatedDate(event.date_start, '') }} - {{ formatedDate(event.date_end, '') }}</h5>
      <p>{{ event.description }}</p>
      <p>{{ event.cost_reduction_factor }}</p>
      <location-card :location="event.location"></location-card>
    </v-card-text>
  </v-card>
</template>

<script>
import LocationCard from '@/components/Cards/LocationCard.vue'
import { formatedDate } from '@/utils/formatters'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { formatedDate, eventMemberStore }
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
  }
}
</script>
