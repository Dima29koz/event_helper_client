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
          @click="joinEvent"
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
          v-if="canEdit"
          type="button"
          color="success"
          class="me-2"
          @click="(sellectedMemberIdx = NaN), (dialogMode = 'add'), (dialogVisible = true)"
        >
          Добавить
        </v-btn>
      </div>
    </div>

    <v-table hover>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">User</th>
          <th scope="col">Ник</th>
          <th scope="col">число дней</th>
          <th scope="col">пьет</th>
          <th scope="col">приедет</th>
          <th v-if="canEdit" scope="col">Действия</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="(member, index) in data" :key="index" @click="editMember(member, index, $event)">
          <th>{{ index + 1 }}</th>
          <td>{{ member.user }}</td>
          <td>{{ member.nickname }}</td>
          <td>{{ member.days_amount }}</td>
          <td>
            <v-icon v-if="member.is_drinker" icon="mdi-checkbox-marked" color="success"></v-icon>
            <v-icon v-else icon="mdi-close-box" color="red"></v-icon>
          </td>
          <td>
            <v-icon v-if="member.is_involved" icon="mdi-checkbox-marked" color="success"></v-icon>
            <v-icon v-else icon="mdi-close-box" color="red"></v-icon>
          </td>
          <td v-if="canEdit">
            <v-btn density="compact" icon>
              <v-icon icon="mdi-cash" color="success" id="btn-money-member"></v-icon>
            </v-btn>
            <v-btn density="compact" icon>
              <v-icon icon="mdi-trash-can-outline" color="red" id="btn-delete-member"></v-icon>
            </v-btn>
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
            :is_editable="canEdit || dialogMode === 'editMe' || dialogMode === 'join'"
            :onSubmit="dialogOnSubmit"
          ></event-member-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn
            v-if="canEdit || dialogMode === 'editMe' || dialogMode === 'join'"
            type="submit"
            form="memberForm"
            color="blue-darken-1"
            variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="moneyDialogVisible" width="500">
      <v-card>
        <v-card-title>
          <span class="text-h5">Изменение взноса участника '{{ sellectedMember().nickname }}'</span>
        </v-card-title>
        <v-card-text>
          <event-member-money-form
            id="memberMoneyForm"
            :member_data="sellectedMember()"
            :onSubmit="onSetMoney"
          ></event-member-money-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="moneyDialogVisible = false" color="blue-darken-1" variant="text">
            Закрыть
          </v-btn>
          <v-btn type="submit" form="memberMoneyForm" color="blue-darken-1" variant="text"
            >Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EventMemberForm from '@/components/Forms/EventMemberForm.vue'
import EventMemberMoneyForm from '@/components/Forms/EventMemberMoneyForm.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-members',
  components: { EventMemberForm, EventMemberMoneyForm },
  setup() {
    const currentUserStore = useCurrentUserStore()
    const eventMemberStore = useEventMemberStore()
    return { currentUserStore, eventMemberStore }
  },
  data() {
    return {
      dialogMode: undefined,
      dialogVisible: false,
      moneyDialogVisible: false,
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
      if (event.target.id == 'btn-delete-member') {
        this.$emit('delMember', member)
        return
      }
      if (event.target.id == 'btn-money-member') {
        this.sellectedMemberIdx = index
        this.moneyDialogVisible = true
        return
      }
      this.sellectedMemberIdx = index
      this.dialogMode = 'editMember'
      this.dialogVisible = true
    },

    joinEvent() {
      if (!this.currentUserStore.isAuth) {
        this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } })
      }
      this.sellectedMemberIdx = NaN
      this.dialogMode = 'join'
      this.dialogVisible = true
    },

    onAddMember(member_data) {
      this.dialogVisible = false
      this.$emit('addMember', member_data)
    },
    onJoinEvent(member_data) {
      this.dialogVisible = false
      this.$emit('joinEvent', member_data)
    },
    onEditMember(member_data) {
      this.dialogVisible = false
      this.$emit('editMember', member_data)
    },
    onEditMe(member_data) {
      this.dialogVisible = false
      this.$emit('editMe', member_data)
    },
    onSetMoney(member_data) {
      this.moneyDialogVisible = false
      this.$emit('setMemberMoney', member_data)
    }
  },
  computed: {
    canEdit() {
      return this.eventMemberStore.hasOneOfRoles(['organizer', 'creator'])
    },
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
