<template>
    <div class="modal fade" ref="locationModal" tabindex="-1" aria-hidden="true" @keydown.esc="modal.hide()">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="ModalLabel">Адрес {{ location.name }}</h5>
                    <button type="button" class="btn-close" @click="modal.hide()" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent>
                        <div class="form-floating">
                            <input v-focus :value="location.name" ref="name" type="text" class="form-control"
                                placeholder="Название">
                            <label>Название</label>
                        </div>
                        <div class="form-floating">
                            <input :value="location.description" ref="description" type="text" class="form-control"
                                placeholder="Описание">
                            <label>Описание</label>
                        </div>
                        <div class="form-floating">
                            <textarea :value="location.address" ref="address" rows="4" class="form-control"
                                placeholder="Адрес" style="height: 100px"></textarea>
                            <label>Адрес</label>
                        </div>
                        <div class="form-floating">
                            <input :value="location.geo" ref="geo" type="text" class="form-control"
                                placeholder="Геолокация">
                            <label>Координаты</label>
                        </div>
                        <div class="form-floating">
                            <input :value="location.maps_link" ref="maps_link" type="url" class="form-control"
                                placeholder="Ссылка на карту">
                            <label>Ссылка на карту</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="modal.hide()">Закрыть</button>
                    <button type="button" class="btn btn-primary" @click="updateLocation">Сохранить изменения</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

import { edit_location } from "@/utils/api_user_account"

export default {
    data() {
        return {
            modal: null,
            // modified_location: {},
        }
    },
    props: {
        modalVisible: {
            type: Boolean,
            default: false
        },
        location: {},
    },

    methods: {
        updateLocation() {
            this.location.name = this.$refs.name.value;
            this.location.description = this.$refs.description.value;
            this.location.address = this.$refs.address.value;
            this.location.geo = this.$refs.geo.value;
            this.location.maps_link = this.$refs.maps_link.value;
            edit_location(this.location.id, this.location);
            this.modal.hide();
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
        // this.modified_location = this.location;
        this.modal.show();
    },
}
</script>