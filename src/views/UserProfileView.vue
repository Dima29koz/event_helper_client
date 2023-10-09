<template>
  <v-container>
    <h1>Настройки профиля</h1>

    <!-- Email -->
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col cols="4" class="d-flex justify-start">
                Электронная почта
                <span v-if="currentUser.is_email_verified" class="p-2 px-0">✅</span>
                <span v-else class="p-2 px-0">❌</span>
              </v-col>

              <v-col cols="8" class="text-grey">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded" key="0"> Укажите новую почту </span>
                  <span v-else key="1">
                    {{ currentUser.email }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="d-flex flex-row">
            <v-text-field v-model="email" hide-details placeholder="email@yours.com"></v-text-field>
            <v-btn class="ms-2 align-self-center" disabled>Сохранить</v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="mt-3 text-start">
      <p>id: {{ currentUser.id }}</p>
      <p>username: {{ currentUser.username }}</p>
      <p>full_name: {{ currentUser.full_name }}</p>
      <p>contacts: {{ currentUser.contacts }}</p>
      <p>email: {{ currentUser.email }}</p>
      <p>phone: {{ currentUser.phone }}</p>
      <p>is_email_verified: {{ currentUser.is_email_verified }}</p>
    </div>
  </v-container>
</template>

<script>
import { useCurrentUserStore } from '../stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },
  data() {
    return {
      email: ''
    }
  },
  computed: {
    currentUser() {
      return this.currentUserStore
    }
  }
}
</script>
