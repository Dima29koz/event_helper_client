import { defineStore } from 'pinia'
import { get_member_info } from '@/utils/api_event_management'

export const useEventMemberStore = defineStore('eventMember', {
  state: () => ({
    roles: []
  }),
  getters: {
    getRoles(state) {
      return state.roles
    }
  },
  actions: {
    setRoles(roles) {
      this.roles = roles
    },
    async fetchMemberInfo(event_key) {
      let member_info = await get_member_info(event_key)
      this.roles = member_info.roles
    },
    hasOneOfRoles(roles) {
      return roles.some((role) => this.roles.includes(role))
    }
  }
})
