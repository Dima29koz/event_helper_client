<template>
  <v-card class="text-start">
    <v-card-title class="d-flex align-center">
      <div>{{ location.name }}</div>
      <v-btn icon class="ms-4">
        <a :href="location.maps_link" target="_blank"
          ><v-icon size="x-large">mdi-map-marker</v-icon></a
        >
      </v-btn>
    </v-card-title>
    <v-card-text>
      <p>{{ location.address }}</p>
      <div v-html="location.description"></div>
      <p>{{ location.geo }}</p>
    </v-card-text>
  </v-card>
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
