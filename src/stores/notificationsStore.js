import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: new Map()
  }),

  actions: {
    addNotification(text, type) {
      const notificationId = crypto.randomUUID()
      const notificationData = { text: text, type: type }
      this.notifications.set(notificationId, notificationData)
      setTimeout(() => this.removeNotification(notificationId), 4000)
    },

    removeNotification(notificationId) {
      this.notifications.delete(notificationId)
    }
  }
})
