<template>
  <div class="card text-start">
    <h5 class="card-header">{{ location.name }}</h5>
    <div class="card-body">
      <h5 class="card-title">Адрес: {{ location.address }}</h5>
      <div class="card-text">
        <p>{{ location.description }}</p>
        <p>{{ location.geo }}</p>
        <a :href="location.maps_link" target="_blank">Посмотреть на карте</a>
      </div>
    </div>
  </div>
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
