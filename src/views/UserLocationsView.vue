<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>Мои адреса</h1>
          <button type="button" class="btn btn-success" @click="onCreateLocation">Добавить</button>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Название</th>
          <th scope="col">Удалить</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr
          v-for="(location, index) in locations"
          :key="location.id"
          @click="locationInfo(location, index, $event)"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ location.name }}</td>
          <td><button class="btn btn-outline-danger" name="delete-location">x</button></td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="dialogVisible"
      :title="
        !isNaN(this.selectedLocationIdx) ? 'Адрес ' + locationByIdx().name : 'Создание адреса'
      "
      @close="dialogVisible = false"
    >
      <template #body>
        <location-form
          :location="locationByIdx()"
          :onSubmit="!isNaN(this.selectedLocationIdx) ? updateLocation : addLocation"
          v-model:isSubmited="isSubmited"
        ></location-form>
      </template>
      <template #footer>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-dismiss="modal"
          @click="isSubmited = true"
        >
          Сохранить
        </button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import LocationForm from '@/components/Forms/LocationForm.vue'
import {
  get_locations,
  get_location,
  delete_location,
  edit_location,
  create_location
} from '../utils/api_user_account'

export default {
  data() {
    return {
      dialogVisible: false,
      selectedLocationIdx: NaN,
      isSubmited: false,
      locations: []
    }
  },

  components: {
    LocationForm
  },

  methods: {
    locationByIdx() {
      if (isNaN(this.selectedLocationIdx)) {
        return null
      }
      return this.locations[this.selectedLocationIdx]
    },

    onCreateLocation() {
      this.selectedLocationIdx = NaN
      this.dialogVisible = true
    },

    deleteLocation(location) {
      delete_location(location.id)
      this.locations = this.locations.filter((loc) => loc.id !== location.id)
    },

    async locationInfo(location, index, event) {
      if (event.target.name == 'delete-location') {
        this.deleteLocation(location)
        return
      }
      let location_data = await get_location(location.id)
      this.selectedLocationIdx = index
      this.locations[index] = location_data
      this.dialogVisible = true
    },

    async getLocations() {
      this.locations = await get_locations()
    },

    updateLocation(location_data) {
      this.isSubmited = false
      edit_location(location_data.id, location_data)
      let location_idx = this.locations.findIndex((element) => element.id == location_data.id)
      this.locations[location_idx] = location_data
    },

    async addLocation(location_data) {
      this.isSubmited = false
      let new_location = await create_location(location_data)
      this.locations.push(new_location)
    }
  },
  mounted() {
    this.getLocations()
  }
}
</script>
