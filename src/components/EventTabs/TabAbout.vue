<template>
  <div>
    <event-about-card
      :event="data"
      @delEvent="this.$emit('delEvent')"
      @editEvent="dialogVisible = true"
    ></event-about-card>

    <b-modal
      v-if="dialogVisible"
      :title="'Изменение события'"
      @close="dialogVisible = false"
      ref="modalElem"
    >
      <template #body>
        <event-edit-form
          id="eventForm"
          :event_data="data"
          :onSubmit="onEditEvent"
        ></event-edit-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="eventForm">Сохранить</button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import EventAboutCard from '@/components/Cards/EventAboutCard.vue'
import EventEditForm from '@/components/Forms/EventEditForm.vue'

export default {
  name: 'tab-about',
  components: { EventAboutCard, EventEditForm },
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
      this.$refs.modalElem.modal.hide()
      this.$emit('editEvent', data)
      this.$emit('editLocation', data.location)
    }
  }
}
</script>
