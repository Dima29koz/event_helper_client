<template>
  <RegistrationForm @register="createUser" :error="error"> </RegistrationForm>
</template>

<script>
import RegistrationForm from '@/components/Forms/RegistrationForm.vue'
import { registration } from '@/utils/api_user_account'

export default {
  data() {
    return {
      error: null
    }
  },
  components: {
    RegistrationForm
  },
  methods: {
    async createUser(new_user) {
      const res = await registration(
        new_user.username,
        new_user.full_name,
        new_user.email,
        new_user.password,
        new_user.phone,
        new_user.contacts
      )
      if ('msg' in res && res.msg == 'username is not allowed') {
        this.error = 'Пользователь с таким именем уже существует'
      } else {
        this.$router.push('login')
      }
    }
  }
}
</script>

<style scoped></style>
