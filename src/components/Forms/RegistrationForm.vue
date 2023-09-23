<template>
  <div class="form-signin">
    <VForm @submit="registrateUser" :validation-schema="schema">
      <h1 class="h3 mb-3 fw-normal">Регистрация</h1>

      <div class="form-floating">
        <Field
          v-focus
          v-model="new_user.username"
          name="username"
          type="text"
          class="form-control"
          placeholder="Логин"
        />
        <label for="username">Логин</label>
        <slot>
          <ErrorMessage as="div" name="username" class="alert alert-danger p-1" />
        </slot>
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.full_name"
          name="name"
          id="name"
          type="text"
          class="form-control"
          placeholder="ФИО"
        />
        <label for="name">ФИО</label>
        <ErrorMessage as="div" name="name" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.email"
          name="email"
          id="email"
          type="email"
          class="form-control"
          placeholder="email"
        />
        <label for="email">email</label>
        <ErrorMessage as="div" name="email" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.phone"
          name="tel"
          id="tel"
          type="text"
          class="form-control"
          placeholder="Телефон"
        />
        <label for="tel">Телефон</label>
        <ErrorMessage as="div" name="tel" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.contacts"
          name="contacts"
          id="contacts"
          type="text"
          class="form-control"
          placeholder="Контакты"
        />
        <label for="contacts">Контакты</label>
        <ErrorMessage as="div" name="contacts" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.password"
          name="password"
          id="password"
          type="password"
          class="form-control"
          placeholder="Пароль"
        />
        <label for="password">Пароль</label>
        <ErrorMessage as="div" name="password" class="alert alert-danger p-1" />
      </div>
      <div class="form-floating">
        <Field
          v-model="new_user.password_repeat"
          name="passwordRepeat"
          id="passwordRepeat"
          type="password"
          class="form-control"
          placeholder="Повторите пароль"
        />
        <label for="passwordRepeat">Повторите пароль</label>
        <ErrorMessage as="div" name="passwordRepeat" class="alert alert-danger p-1" />
      </div>

      <button class="btn btn-primary w-100 py-2" type="submit">Создать аккаунт</button>
    </VForm>
  </div>
</template>

<script setup>
import yup from 'yup'

const schema = yup.object({
  username: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  passwordRepeat: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
})
</script>

<script>
import { Form as VForm, Field, ErrorMessage } from 'vee-validate'

export default {
  components: {
    VForm,
    Field,
    ErrorMessage
  },

  data() {
    return {
      new_user: {
        username: '',
        full_name: '',
        email: '',
        phone: '',
        contacts: '',
        password: '',
        password_repeat: ''
      }
    }
  },
  methods: {
    registrateUser() {
      if (this.new_user.password != this.new_user.password_repeat) {
        console.log('pass not eq')
      } else {
        this.$emit('register', this.new_user)
      }
    }
  }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 600px;
  padding: 15px;
  margin: auto;
}
</style>
