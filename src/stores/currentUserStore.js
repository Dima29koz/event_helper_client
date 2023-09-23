import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    isAuth: false,
    id: null,
    username: '',
    full_name: '',
    contacts: null,
    email: '',
    phone: null,
    is_email_verified: false
  }),
  getters: {
    currentUser(state) {
      return { ...state }
    }
  },
  actions: {
    authenticate() {
      this.isAuth = true
    },
    setData(data) {
      this.isAuth = true
      this.id = data.id
      this.username = data.username
      this.full_name = data.full_name
      this.contacts = data.contacts
      this.email = data.email
      this.phone = data.phone
      this.is_email_verified = data.is_email_verified
    },
    logout() {
      this.$reset()
    }
  }
})
