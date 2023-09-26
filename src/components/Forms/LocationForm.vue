<template>
  <form @submit.prevent>
    <div class="form-floating">
      <input
        v-focus
        v-model="local_location.name"
        ref="name"
        type="text"
        class="form-control"
        placeholder="Название"
      />
      <label>Название</label>
    </div>
    <div class="form-floating">
      <input
        v-model="local_location.description"
        ref="description"
        type="text"
        class="form-control"
        placeholder="Описание"
      />
      <label>Описание</label>
    </div>
    <div class="form-floating">
      <textarea
        v-model="local_location.address"
        ref="address"
        rows="4"
        class="form-control"
        placeholder="Адрес"
        style="height: 100px"
      ></textarea>
      <label>Адрес</label>
    </div>
    <div class="form-floating">
      <input
        v-model="local_location.geo"
        ref="geo"
        type="text"
        class="form-control"
        placeholder="Геолокация"
      />
      <label>Координаты</label>
    </div>
    <div class="form-floating">
      <input
        v-model="local_location.maps_link"
        ref="maps_link"
        type="text"
        class="form-control"
        placeholder="Ссылка на карту"
      />
      <label>Ссылка на карту</label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'location-form',
  data() {
    return {
      local_location: this.location
        ? { ...this.location }
        : {
            name: '',
            description: '',
            address: '',
            geo: '',
            maps_link: ''
          }
    }
  },

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
    },
    onSubmit: null,
    isSubmited: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    isSubmited(newValue) {
      if (newValue) {
        this.onSubmit(this.local_location)
      }
    }
  }
}
</script>
