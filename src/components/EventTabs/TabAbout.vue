<template>
  <div>
    <event-info-form v-if="data" :event_data="data"></event-info-form>
  </div>
</template>

<script>
import EventInfoForm from '@/components/Forms/EventInfoForm.vue'

export default {
  name: 'tab-about',
  components: { EventInfoForm },
  props: {
    data: {}
  }
}
</script>
