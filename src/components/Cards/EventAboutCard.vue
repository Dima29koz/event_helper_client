<template>
  <div class="card text-start">
    <h5 class="card-header d-flex justify-content-between">
      <div>{{ event.title }}</div>
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ⁝
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" @click="this.$emit('editEvent')">Изменить</button></li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button class="dropdown-item text-danger" @click="this.$emit('delEvent')">
              Удалить
            </button>
          </li>
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

<script setup>
import { formatedDate } from '@/utils/time'
</script>

<script>
import LocationCard from '@/components/Cards/LocationCard.vue'

export default {
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
