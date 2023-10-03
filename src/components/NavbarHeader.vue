<template>
  <div class="container">
    <header
      class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom"
    >
      <div class="mb-2 mb-md-0 border">logo</div>

      <ul id="123" class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><router-link to="/">Главная</router-link></li>
        <template v-if="currentUser.isAuth">
          <li><router-link to="/events">События</router-link></li>
        </template>
        <li><router-link to="/about">FAQ</router-link></li>
      </ul>

      <div class="col-md-3 text-end">
        <div class="d-flex justify-content-end">
          <template v-if="currentUser.isAuth">
            <div class="nav-item dropdown">
              <button
                class="d-flex ms-sm-auto nav-link active text-decoration-none"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="@/assets/default_avatar.jpg"
                  alt=""
                  width="32"
                  height="32"
                  class="rounded-circle me-2"
                />
                <p class="my-0 dropdown-toggle">{{ currentUser.username }}</p>
              </button>
              <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser">
                <li>
                  <router-link to="/profile_settings" class="dropdown-item"
                    >Настройки профиля</router-link
                  >
                </li>
                <li><router-link to="/locations" class="dropdown-item">Мои адреса</router-link></li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <a @click="logout" type="button" class="dropdown-item">Выйти</a>
              </ul>
            </div>
          </template>

          <template v-else>
            <button
              @click="$router.push({ name: 'login' })"
              type="button"
              class="btn btn-outline-primary me-2"
            >
              Вход
            </button>
            <button
              @click="$router.push({ name: 'registration' })"
              type="button"
              class="btn btn-primary"
            >
              Регистрация
            </button>
          </template>
          <color-mode-toggler></color-mode-toggler>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { useCurrentUserStore } from '../stores/currentUserStore'
import ColorModeToggler from '@/components/ColorModeToggler.vue'
import { logout } from '@/utils/api_user_account'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },
  components: {
    ColorModeToggler
  },
  methods: {
    async logout() {
      let r = await logout()
      console.log(r)
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
li a {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
  font-weight: bold;
  color: #2c3e50;
}

li a.router-link-exact-active {
  color: #42b983;
}
</style>
