<template>
  <div class="text-center">
    <v-menu
      v-if="member.user && isAccessible"
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          @click="fetchUserInfo"
          class="d-flex text-capitalize text-subtitle-1"
          variant="tonal"
        >
          <p>{{ member.nickname }}</p>
          <v-tooltip text="Организатор" v-if="member.role == 'organizer'">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                icon="mdi-star"
                size="x-small"
                color="yellow-darken-1"
                class="align-self-start ms-1"
              ></v-icon>
            </template>
          </v-tooltip>
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item :title="user.full_name">
            <template v-slot:prepend>
              <v-icon icon="mdi-account" size="x-large"></v-icon>
            </template>
            <template v-slot:append>
              <v-btn variant="text" icon="mdi-close" @click="menu = false"></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            prepend-icon="mdi-phone"
            :href="'tel:' + formatPhoneNumberInternational(user.phone)"
          >
            {{ formatPhoneNumber(user.phone) }}
          </v-list-item>
          <v-list-item prepend-icon="mdi-card-account-mail">
            {{ user.contacts }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <div v-else class="d-flex text-capitalize ms-4">
      <p>{{ member.nickname }}</p>
      <v-tooltip text="Организатор" v-if="member.role == 'organizer'">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-star"
            size="x-small"
            color="yellow-darken-1"
            class="align-self-start ms-1"
          ></v-icon>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { profileInfo } from '@/utils/api_user_account'
import { useEventMemberStore } from '@/stores/eventMemberStore'
import { formatPhoneNumber, formatPhoneNumberInternational } from '@/utils/formatters'

export default {
  name: 'user-contacts-card',
  setup() {
    const eventMemberStore = useEventMemberStore()

    return { eventMemberStore, formatPhoneNumber, formatPhoneNumberInternational }
  },
  data() {
    return {
      menu: false,
      user: {
        full_name: '',
        phone: '',
        contacts: ''
      },

      message: false,
      hints: true
    }
  },
  props: {
    member: {}
  },
  methods: {
    async fetchUserInfo() {
      this.user = await profileInfo(this.member.user)
    }
  },
  computed: {
    isAccessible() {
      return (
        this.member.role === 'organizer' ||
        this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
      )
    }
  }
}
</script>
