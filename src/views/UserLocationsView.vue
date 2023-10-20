<template>
  <v-container>
    <v-table hover class="pa-2 rounded">
      <caption>
        <div class="d-flex justify-space-between align-center">
          <h1>Мои адреса</h1>
          <v-btn @click="onCreateLocation" color="success">
            <v-icon size="x-large">mdi-plus</v-icon>
          </v-btn>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" class="text-left">Название</th>
          <th scope="col" class="text-center">Действия</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr
          v-for="(location, index) in locations"
          :key="location.id"
          @click="locationInfo(location, index, $event)"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td class="text-left">{{ location.name }}</td>
          <td class="text-center">
            <v-btn density="compact" name="delete-location" icon>
              <v-icon icon="mdi-trash-can-outline" color="red"></v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialogVisible" width="1024">
      <v-card>
        <v-card-title>
          <span class="text-h5"> {{ dialogTitle }} </span>
        </v-card-title>
        <v-card-text>
          <location-form
            id="locationForm"
            :location="locationByIdx()"
            :onSubmit="!isNaN(this.selectedLocationIdx) ? updateLocation : addLocation"
          ></location-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="locationForm" color="blue-darken-1" variant="text">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
      if (event.target.name == 'delete-location' || event.target.tagName == 'I') {
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
      this.dialogVisible = false
      edit_location(location_data.id, location_data)
      let location_idx = this.locations.findIndex((element) => element.id == location_data.id)
      this.locations[location_idx] = location_data
    },

    async addLocation(location_data) {
      this.dialogVisible = false
      let new_location = await create_location(location_data)
      this.locations.push(new_location)
    }
  },
  computed: {
    dialogTitle() {
      return !isNaN(this.selectedLocationIdx)
        ? 'Адрес ' + this.locationByIdx().name
        : 'Создание адреса'
    }
  },
  mounted() {
    this.getLocations()
  }
}
</script>
