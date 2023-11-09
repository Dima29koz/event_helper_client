import { defineStore } from 'pinia'
import { useCurrentUserStore } from '@/stores/currentUserStore'

const currentUserStore = useCurrentUserStore()

export const useEventStore = defineStore('event', {
  state: () => ({
    members: [],
    selected_buyer: null
  }),
  getters: {
    getMemberMe(state) {
      const me = state.members.find((e) => e.user === currentUserStore.username)
      return me ? me : null
    },
    getMembersAmount(state) {
      return state.members.length
    }
  },
  actions: {
    reset() {
      this.$reset()
    },
    setMembers(members) {
      members.forEach((member) => {
        this._fixMemberDate(member)
      })
      this.members = members
      if (this.selected_buyer === null) {
        this.selected_buyer = this.getMemberMe
      }
    },
    getMember(memberID) {
      return this.members.find((e) => e.id === memberID)
    },
    updateMember(memberData) {
      const member_idx = this.members.findIndex((member) => member.id === memberData.id)
      memberData = this._fixMemberDate(memberData)
      this.members[member_idx] = memberData
    },
    addMember(memberData) {
      memberData = this._fixMemberDate(memberData)
      this.members.push(memberData)
      if (this.selected_buyer === null) {
        this.selected_buyer = this.getMemberMe
      }
    },
    deleteMember(memberID) {
      this.members = this.members.filter((member) => member.id !== memberID)
      if (memberID === this.selected_buyer?.id) {
        this.selected_buyer = this.getMemberMe
      }
    },
    _fixMemberDate(memberData) {
      if (memberData.date_from) {
        memberData.date_from = new Date(memberData.date_from)
      }
      if (memberData.date_to) {
        memberData.date_to = new Date(memberData.date_to)
      }
      return memberData
    }
  }
})
