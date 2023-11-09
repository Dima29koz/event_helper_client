<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="tonal" class="h-100 ms-4">
        <v-icon size="x-large">mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card min-width="300">
      <template v-slot:title>
        <div class="d-flex justify-space-between align-center">
          <div>Настройки</div>
          <v-btn variant="text" icon="mdi-close" @click="menu = false"></v-btn>
        </div>
      </template>

      <div class="text-subtitle-1 text-medium-emphasis">
        <v-icon icon="mdi-account" size="x-large"></v-icon>Кем производится покупка?
      </div>
      <v-autocomplete
        v-model="eventStore.selected_buyer"
        label="Выберите участника"
        :items="eventStore.members"
        item-title="nickname"
        return-object
        auto-select-first
      >
      </v-autocomplete>
    </v-card>
  </v-menu>
</template>

<script>
import { useEventStore } from '@/stores/eventStore'

export default {
  name: 'products-options-card',
  setup() {
    const eventStore = useEventStore()
    return { eventStore }
  },
  data() {
    return {
      menu: false
    }
  }
}
</script>
