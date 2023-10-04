<template>
  <div class="card text-start">
    <h5 class="card-header d-flex justify-content-between">
      <div>{{ event.title }}</div>
      <div class="dropdown">
        <button
          v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
          class="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ⁝
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" @click="this.$emit('editEvent')">Изменить</button></li>
          <template v-if="eventMemberStore.hasOneOfRoles(['creator'])">
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button class="dropdown-item text-danger" @click="this.$emit('delEvent')">
                Удалить
              </button>
            </li>
          </template>
        </ul>
      </div>
    </h5>
    <div class="card-body">
      <h5 class="card-title">
        {{ formatedDate(event.date_start, '') }} - {{ formatedDate(event.date_end, '') }}
      </h5>
      <div class="card-text">
        <p>{{ event.description }}</p>
        <p>{{ event.cost_reduction_factor }}</p>
        <location-card :location="event.location"></location-card>
      </div>
    </div>
  </div>
</template>

<script>
import LocationCard from '@/components/Cards/LocationCard.vue'
import { formatedDate } from '@/utils/time'
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
