<template>
  <v-container>
    <event-about-card
      :event="data"
      @delEvent="this.$emit('delEvent')"
      @editEvent="dialogVisible = true"
    ></event-about-card>

    <v-dialog v-model="dialogVisible" width="1000" :fullscreen="$vuetify.display.mobile">
      <v-card>
        <v-card-title>
          <span class="text-h5">Изменение события</span>
        </v-card-title>
        <v-card-text>
          <event-form id="eventForm" :event_data="data" :onSubmit="onEditEvent"></event-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="eventForm" color="blue-darken-1" variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventAboutCard from '@/components/Cards/EventAboutCard.vue'
import EventForm from '@/components/Forms/EventForm.vue'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-about',
  components: { EventAboutCard, EventForm },
  setup() {
    const eventMemberStore = useEventMemberStore()
    return { eventMemberStore }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    data: {}
  },
  methods: {
    onEditEvent(data) {
      this.dialogVisible = false
      this.$emit('editEvent', data)
      this.$emit('editLocation', data.location)
    }
  }
}
</script>
