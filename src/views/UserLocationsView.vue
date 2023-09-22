<template>
    <div class="container">
        <div class="d-flex justify-content-between">
            <h1>Мои адреса</h1>
            <button type="button" class="btn btn-success" @click="createLocation">Добавить</button>
        </div>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Название</th>
                    <th scope="col">Удалить</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <tr v-for="(location, index) in locations" @click="locationInfo(location, index, $event)">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ location.name }}</td>
                    <td><button class="btn btn-outline-danger" name="delete-location">x</button></td>
                </tr>
            </tbody>
        </table>

        <LocationModal v-if="dialogVisible" v-model:modalVisible="dialogVisible" :location="locationByIdx()"
            @close="dialogVisible = false" @newLocation="addLocation"></LocationModal>

    </div>
</template>

<script>
import LocationModal from "@/components/LocationModal"
import { get_locations, get_location, delete_location } from "@/utils/api_user_account"

export default {
    data() {
        return {
            dialogVisible: false,
            selectedLocationIdx: NaN,
            locations: [],
        }
    },

    components: {
        LocationModal
    },

    methods: {
        locationByIdx() {
            if (isNaN(this.selectedLocationIdx)) { return {} }
            return this.locations[this.selectedLocationIdx]
        },


        createLocation() {
            this.selectedLocationIdx = NaN;
            this.dialogVisible = true;
        },

        deleteLocation(location, index) {
            delete_location(location.id);
            this.locations = this.locations.filter(loc => loc.id !== location.id);
        },

        addLocation(new_location) {
            this.locations.push(new_location);
        },

        async locationInfo(location, index, event) {
            if (event.target.name == 'delete-location') {
                this.deleteLocation(location, index)
                return;
            }
            let location_data = await get_location(location.id);
            this.selectedLocationIdx = index;
            this.locations[index] = location_data;
            this.dialogVisible = true;
        },

        async getLocations() {
            this.locations = await get_locations();
        },

    },
    mounted() {
        this.getLocations();
    }
}
</script>