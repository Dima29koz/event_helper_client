<template>
  <div class="h-100 d-flex flex-column">
    <v-spacer></v-spacer>
    <div class="align-end">
      <v-footer class="text-center d-flex flex-column" :elevation="20">
        <h4>Связаться с нами</h4>
        <div class="w-100">
          <v-spacer></v-spacer>

          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="message"
                  variant="filled"
                  clear-icon="mdi-close-circle"
                  clearable
                  label="Message"
                  type="text"
                >
                  <template v-slot:prepend>
                    <v-btn class="mx-4" variant="text" :href="icons.discord" target="_blank" icon>
                      <v-icon><IconDiscord></IconDiscord></v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:append>
                    <v-btn
                      @click="sendMessage"
                      :disabled="!message"
                      class="mx-4"
                      variant="text"
                      icon
                    >
                      <v-icon icon="mdi-send"></v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </div>

        <div class="px-4 py-2 text-center w-100">
          {{ new Date().getFullYear() }} — <strong>EventHelper Team</strong>
        </div>
      </v-footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import IconDiscord from '@/components/icons/IconDiscord.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'

export default {
  name: 'home-view',
  components: { IconDiscord },
  setup() {
    const currentUserStore = useCurrentUserStore()

    return { currentUserStore }
  },
  data() {
    return {
      message: '',
      icons: { discord: import.meta.env.VITE_DISCORD_INVITE_URL }
    }
  },
  methods: {
    sendMessage() {
      const message = {
        username: this.currentUserStore.isAuth ? this.currentUserStore.username : 'guest',
        content: this.message
      }
      axios
        .post(import.meta.env.VITE_DISCORD_WEBHOOK_URL, message)
        .then((response) => {
          console.log('Message sent successfully:', response.data)
          this.message = ''
        })
        .catch((error) => {
          console.error('Error sending message:', error)
        })
    }
  }
}
</script>

<style scoped></style>
