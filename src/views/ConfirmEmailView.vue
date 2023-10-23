<template>
  <v-sheet
    elevation="12"
    max-width="600"
    rounded="lg"
    width="100%"
    class="pa-4 text-center mx-auto my-16"
  >
    <template v-if="confirmationResult">
      <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
      <h2 class="text-h5 mb-6">Почта подтверждена</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">Вы можете закрыть это окно</p>
    </template>
    <template v-else>
      <v-icon class="mb-5" color="red" icon="mdi-close-circle" size="112"></v-icon>
      <h2 class="text-h5 mb-6">Почта не подтверждена</h2>
      <p class="mb-4 text-medium-emphasis text-body-2">{{ hintText }}</p>
    </template>
  </v-sheet>
</template>

<script>
import { confirm_email } from '@/utils/api_user_account'
import { useCurrentUserStore } from '../stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },
  data() {
    return {
      token: '',
      confirmationResult: false,
      confirmationMsg: ''
    }
  },
  methods: {
    async confirmEmail() {
      try {
        this.confirmationMsg = await confirm_email(this.token)
        this.confirmationResult = true
      } catch (e) {
        this.confirmationMsg = e.response.data.msg
      }
    }
  },
  computed: {
    hintText() {
      if (this.confirmationMsg == 'Wrong token') return 'Ошибка в токене'
      return this.confirmationMsg
    }
  },
  mounted() {
    this.token = this.$route.query.token
    if (!this.currentUserStore.is_email_verified) {
      this.confirmEmail()
    } else {
      this.confirmationResult = true
    }
  }
}
</script>
