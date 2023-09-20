<template>
  <div class="form-signin">
    <form @submit.prevent>

      <h1 class="h3 mb-3 fw-normal">Авторизация</h1>

      <div class="form-floating">
        <input v-focus v-model="user.username" type="text" class="form-control" id="floatingInput" placeholder="Логин">
        <label for="floatingInput">Логин</label>
      </div>
      <div class="form-floating">
        <input v-model="user.password" type="password" class="form-control" id="floatingPassword" placeholder="Пароль">
        <label for="floatingPassword">Пароль</label>
      </div>

      <div class="form-check text-start my-3">
        <input v-model="user.remember_me" class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button @click="loginUser" class="btn btn-primary w-100 py-2" type="submit">Войти</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: 'Admin',
        password: '1234',
        remember_me: false,
      },
    }
  },
  methods: {
    loginUser() {
      this.$emit('login', this.user)
      this.user = {
        username: '',
        password: '',
        remember_me: false,
      }
    },
  },
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>