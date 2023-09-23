<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>События</h1>
          <div>
            <button type="button" class="btn btn-primary me-2" disabled>Присоединиться</button>
            <button type="button" class="btn btn-success" disabled>Создать</button>
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
          @click="eventInfo(event, index, $event)"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ event.title }}</td>
          <td>{{ event.role ? event.role : 'creator' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- <LocationModal v-if="dialogVisible" v-model:modalVisible="dialogVisible" :location="eventByIdx()"
            @close="dialogVisible = false" @newLocation="addEvent"></LocationModal> -->
  </div>
</template>

<script>
// import LocationModal from "@/components/LocationModal"
import { get_events } from '@/utils/api_event_management'

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
    // LocationModal
  },

  methods: {
    eventByIdx() {
      if (isNaN(this.selectedLocationIdx)) {
        return {}
      }
      return this.events[this.selectedLocationIdx]
    },

    createEvent() {
      this.selectedEventIdx = NaN
      this.dialogVisible = true
    },

    addEvent(new_event) {
      this.events.push(new_event)
    },

    async eventInfo(event, index, e) {
      console.log(event)
      console.log(index)
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
