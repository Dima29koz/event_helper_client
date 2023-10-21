<template>
  <v-navigation-drawer v-model="sidebar" temporary>
    <v-list :lines="false" nav>
      <v-list-item to="/">Главная</v-list-item>
      <template v-if="currentUser.isAuth">
        <v-list-item to="/events">События</v-list-item>
      </template>
      <v-list-item to="/about">FAQ</v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar flat>
    <template v-slot:prepend>
      <div>
        <v-app-bar-nav-icon
          @click="sidebar = !sidebar"
          class="hidden-sm-and-up"
        ></v-app-bar-nav-icon>
      </div>
    </template>

    <v-tabs v-model="currentTab" class="hidden-xs">
      <v-tab to="/" value="home">Главная</v-tab>
      <template v-if="currentUser.isAuth">
        <v-tab to="/events" value="events">События</v-tab>
      </template>
      <v-tab to="/about" value="about">FAQ</v-tab>
    </v-tabs>

    <template v-slot:append>
      <template v-if="currentUser.isAuth">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <v-avatar :image="avatarSrc" size="32"> </v-avatar>
              <p class="my-0">{{ currentUser.username }}</p>
              <v-icon icon="mdi-menu-down"></v-icon>
            </v-btn>
          </template>
          <v-list :lines="false">
            <v-list-item
              to="/profile_settings"
              @click="currentTab = 'profile'"
              title="Профиль"
            ></v-list-item>
            <v-list-item
              to="/locations"
              @click="currentTab = 'locations'"
              title="Мои адреса"
            ></v-list-item>
            <v-divider class="mt-2"></v-divider>
            <v-list-item
              @click="logout"
              type="button"
              class="font-weight-bold"
              title="Выйти"
            ></v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn :to="{ name: 'login' }" type="button" class="me-2" variant="outlined"> Вход </v-btn>

        <v-btn :to="{ name: 'registration' }" type="button" variant="flat" color="indigo-darken-3">
          Регистрация
        </v-btn>
      </template>
      <color-mode-toggler></color-mode-toggler>
    </template>
  </v-app-bar>
</template>

<script>
import { useCurrentUserStore } from '../stores/currentUserStore'
import ColorModeToggler from '@/components/ColorModeToggler.vue'
import { logout } from '@/utils/api_user_account'
import { ref } from 'vue'

export default {
  name: 'navbar-header',
  setup() {
    const currentUserStore = useCurrentUserStore()
    const avatarSrc = ref('/src/assets/default_avatar.jpg')

    return { currentUserStore, avatarSrc }
  },
  data() {
    return {
      sidebar: false,
      currentTab: '',
      selectedTab: []
    }
  },
  components: {
    ColorModeToggler
  },
  methods: {
    async logout() {
      await logout()
      this.currentUserStore.logout()
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    currentUser() {
      return this.currentUserStore
    }
  }
}
</script>

<style scoped>
a.v-slide-group-item--active,
a.v-tab--selected {
  color: #42b983;
}
</style>
