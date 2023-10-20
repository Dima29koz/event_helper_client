<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          <v-row no-gutters>
            <v-col cols="3" class="d-flex justify-start align-center">
              <div class="text-h6">{{ location.name }}</div>
              <v-btn icon class="ms-2" variant="text" :href="location.maps_link" target="_blank">
                <v-icon size="x-large">mdi-map-marker</v-icon>
              </v-btn>
            </v-col>
            <v-col class="d-flex text-grey align-center">
              <v-fade-transition leave-absolute class="hidden-xs">
                <span v-if="!expanded"> {{ location.address }} </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>{{ location.address }}</p>
        <div v-html="location.description"></div>
        <p>{{ location.geo }}</p>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'location-card',
  props: {
    location: {
      type: Object,
      default: function () {
        return {
          name: '',
          description: '',
          address: '',
          geo: '',
          maps_link: '',
          id: ''
        }
      }
    }
  }
}
</script>
