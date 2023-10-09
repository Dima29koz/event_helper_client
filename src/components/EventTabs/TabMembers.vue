<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h1>Участники:</h1>
      <div>
        <v-btn
          v-if="isNaN(meMemberIdx)"
          type="button"
          color="primary"
          class="me-2"
          @click="(sellectedMemberIdx = NaN), (dialogMode = 'join'), (dialogVisible = true)"
        >
          Присоединиться
        </v-btn>
        <template v-else>
          <v-btn
            type="button"
            color="primary"
            class="me-2"
            @click="
              (sellectedMemberIdx = meMemberIdx), (dialogMode = 'editMe'), (dialogVisible = true)
            "
          >
            Изменить себя
          </v-btn>
          <v-btn type="button" color="red" class="me-2" @click="this.$emit('delMe')">
            Покинуть событие
          </v-btn>
        </template>

        <v-btn
          v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
          type="button"
          color="success"
          class="me-2"
          @click="(sellectedMemberIdx = NaN), (dialogMode = 'add'), (dialogVisible = true)"
        >
          Добавить
        </v-btn>
      </div>
    </div>

    <v-table class="table table-hover caption-top">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">User</th>
          <th scope="col">Ник</th>
          <th scope="col">число дней</th>
          <th scope="col">пьет</th>
          <th scope="col">приедет</th>
          <th v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])" scope="col">
            Удалить
          </th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="(member, index) in data" :key="index" @click="editMember(member, index, $event)">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ member.user }}</td>
          <td>{{ member.nickname }}</td>
          <td>{{ member.days_amount }}</td>
          <td>{{ member.is_drinker }}</td>
          <td>{{ member.is_involved }}</td>
          <td v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])">
            <v-btn name="delete-member" icon="mdi-trash-can-outline" color="red"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialogVisible" width="1000">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <event-member-form
            id="memberForm"
            :member_data="sellectedMember()"
            :is_editable="
              eventMemberStore.hasOneOfRoles(['organizer', 'creator']) ||
              dialogMode === 'editMe' ||
              dialogMode === 'join'
            "
            :onSubmit="dialogOnSubmit"
          ></event-member-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="memberForm" color="blue-darken-1" variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventMemberForm from '@/components/Forms/EventMemberForm.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-members',
  components: { EventMemberForm },
  setup() {
    const currentUserStore = useCurrentUserStore()
    const eventMemberStore = useEventMemberStore()
    return { currentUserStore, eventMemberStore }
  },
  data() {
    return {
      dialogMode: undefined,
      dialogVisible: false,
      sellectedMemberIdx: NaN
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    sellectedMember() {
      if (isNaN(this.sellectedMemberIdx)) {
        return null
      }
      return this.data[this.sellectedMemberIdx]
    },

    editMember(member, index, event) {
      if (event.target.name == 'delete-member') {
        this.$emit('delMember', member)
        return
      }
      this.sellectedMemberIdx = index
      this.dialogMode = 'editMember'
      this.dialogVisible = true
    },

    onAddMember(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('addMember', member_data)
    },
    onJoinEvent(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('joinEvent', member_data)
    },
    onEditMember(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('editMember', member_data)
    },
    onEditMe(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('editMe', member_data)
    }
  },
  computed: {
    dialogTitle() {
      switch (this.dialogMode) {
        case 'add':
          return 'Добавление участника'
        case 'join':
          return 'Присоединиться'
        case 'editMember':
          return 'Изменение участника'
        case 'editMe':
          return 'Изменение себя'
        default:
          return ''
      }
    },
    dialogOnSubmit() {
      switch (this.dialogMode) {
        case 'add':
          return this.onAddMember
        case 'join':
          return this.onJoinEvent
        case 'editMember':
          return this.onEditMember
        case 'editMe':
          return this.onEditMe
        default:
          return () => {}
      }
    },
    meMemberIdx() {
      const idx = this.data.findIndex((e) => e.user === this.currentUserStore.username)
      return idx > -1 ? idx : NaN
    }
  },
  mounted() {
    this.$emit('getMembers')
  }
}
</script>
