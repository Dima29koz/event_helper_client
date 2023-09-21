<template>
    <div>
        <h1>Мои адреса</h1>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Название</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(location, index) in locations" @click="locationInfo(location, index)">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ location.name }}</td>
                </tr>
            </tbody>
        </table>

        <LocationModal v-if="dialogVisible" v-model:modalVisible="dialogVisible"
            v-model:location="locations[selectedLocationIdx]" @close="dialogVisible = false"></LocationModal>

    </div>
</template>

<script>
import LocationModal from "@/components/LocationModal"
import { get_locations, get_location } from "@/utils/api_user_account"

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
        async locationInfo(location, index) {
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