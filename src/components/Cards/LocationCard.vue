<template>
  <v-card :title="location.name" class="text-start">
    <v-card-text>
      <p>{{ location.description }}</p>
      <p>{{ location.geo }}</p>
      <a :href="location.maps_link" target="_blank">Посмотреть на карте</a>
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
