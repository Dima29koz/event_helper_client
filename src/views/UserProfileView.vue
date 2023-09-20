<template>
    <div class="container">
        <h1>Настройки профиля</h1>
        <!-- Email -->
        <div class="card card-body">
            <div class="d-flex flex-row justify-content-between pb-2">
                <div class="d-flex align-items-left">
                    <div class="p-2 px-0">Электронная почта</div>
                    <span v-if="currentUser.is_email_verified" class="p-2 px-0">✅</span>
                    <span v-else class="p-2 px-0">❌</span>
                </div>

                <div class="p-2">{{ currentUser.email }}</div>
                <div>
                    <button class="btn btn-primary" data-bs-toggle="collapse" href="#EmailCollapse" role="button"
                        aria-expanded="false" aria-controls="EmailCollapse">
                        Изменить
                    </button>
                </div>
            </div>
            <div class="collapse" id="EmailCollapse">
                <form @submit.prevent class="form-contact">
                    <div class="row g-3 align-items-left">
                        <div class="col-3"><label class="col-form-label" for="new_email">Новый адрес:</label></div>
                        <div class="col-5">
                            <div class="d-flex flex-row">
                                <input class="form-control" id="new_email" name="new_email" required type="email">
                            </div>
                        </div>
                        <div class="col">
                            <button class="btn btn-primary" id="ChangeEmail" name="submit" type="submit" disabled>Сохранить
                                адрес</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="mt-3 text-start">
            <p>id: {{ currentUser.id }}</p>
            <p>username: {{ currentUser.username }}</p>
            <p>full_name: {{ currentUser.full_name }}</p>
            <p>contacts: {{ currentUser.contacts }}</p>
            <p>email: {{ currentUser.email }}</p>
            <p>phone: {{ currentUser.phone }}</p>
            <p>is_email_verified: {{ currentUser.is_email_verified }}</p>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            currentUser: 'current_user/currentUser',
        }),
    },
}
</script>