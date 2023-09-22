<template>
    <div class="modal fade" ref="locationModal" tabindex="-1" aria-hidden="true" @keydown.esc="modal.hide()">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalLabel">Адрес {{ location.name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <location-form :location="{ ...location }" :onSubmit="isLocation() ? updateLocation : createLocation"
                        v-model:isSubmited="isSubmited"></location-form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                    <button type="button" class="btn btn-primary" @click="isSubmited = true">Сохранить изменения</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

import LocationForm from "@/components/Forms/LocationForm"
import { edit_location, create_location } from "@/utils/api_user_account"

export default {
    data() {
        return {
            modal: null,
            isSubmited: false,
        }
    },

    components: {
        LocationForm,
    },

    props: {
        modalVisible: {
            type: Boolean,
            default: false
        },
        location: {
            name: '',
            description: '',
            address: '',
            geo: '',
            maps_link: '',
        },
    },

    methods: {
        isLocation() {
            return !!Object.keys(this.location).length;
        },

        updateLocation(location_data) {
            this.location.name = location_data.name;
            this.location.description = location_data.description;
            this.location.address = location_data.address;
            this.location.geo = location_data.geo;
            this.location.maps_link = location_data.maps_link;
            edit_location(this.location.id, this.location);
            this.modal.hide();
        },

        async createLocation(location_data) {
            this.location.name = location_data.name;
            this.location.description = location_data.description;
            this.location.address = location_data.address;
            this.location.geo = location_data.geo;
            this.location.maps_link = location_data.maps_link;
            let new_location = await create_location(location_data);
            console.log(this.location);
            console.log(new_location);
            this.modal.hide();
            this.$emit('newLocation', new_location);
        },
    },

    watch: {
        modalVisible(newValue, oldValue) {

            if (this.modalVisible) {
                this.modal.show();
            }
            else {
                this.modal.hide();
            }
        }
    },

    mounted() {
        this.modal = new Modal(this.$refs.locationModal);
        this.$refs.locationModal.addEventListener('hidden.bs.modal', event => {
            this.$emit('close');
        })
        this.modal.show();
    },
}
</script>