<template>
    <form @submit.prevent>
        <div class="form-floating">
            <input v-focus v-model="name" ref="name" type="text" class="form-control" placeholder="Название">
            <label>Название</label>
        </div>
        <div class="form-floating">
            <input v-model="description" ref="description" type="text" class="form-control" placeholder="Описание">
            <label>Описание</label>
        </div>
        <div class="form-floating">
            <textarea v-model="address" ref="address" rows="4" class="form-control" placeholder="Адрес"
                style="height: 100px"></textarea>
            <label>Адрес</label>
        </div>
        <div class="form-floating">
            <input v-model="geo" ref="geo" type="text" class="form-control" placeholder="Геолокация">
            <label>Координаты</label>
        </div>
        <div class="form-floating">
            <input v-model="maps_link" ref="maps_link" type="text" class="form-control" placeholder="Ссылка на карту">
            <label>Ссылка на карту</label>
        </div>

    </form>
</template>

<script>
export default {
    name: "location-form",
    data() {
        return {
            name: '',
            description: '',
            address: '',
            geo: '',
            maps_link: '',
        }
    },

    props: {
        location: {
            type: Object,
            default: {
                name: '',
                description: '',
                address: '',
                geo: '',
                maps_link: '',
            }
        },
        onSubmit: null,
        isSubmited: false,
    },

    watch: {
        isSubmited(newValue) {
            if (newValue) {
                this.onSubmit(this)
            }

        }
    },

    mounted() {
        this.name = this.location.name;
        this.description = this.location.description;
        this.address = this.location.address;
        this.geo = this.location.geo;
        this.maps_link = this.location.maps_link;
    },

}
</script>