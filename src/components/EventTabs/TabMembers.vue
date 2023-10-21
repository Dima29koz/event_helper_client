<template>
  <v-container>
    <v-data-table
      :headers="tableHeaders"
      :items="data"
      :items-per-page="-1"
      :search="search"
      :sort-by="sortBy"
      multi-sort
      hover
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Найти..."
          single-line
          hide-details
        >
          <template v-slot:append>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="text" icon="mdi-cog"></v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-if="canEdit"
                  title="Добавить"
                  @click="addMember"
                  append-icon="mdi-plus"
                ></v-list-item>
                <v-list-item
                  v-if="isNaN(meMemberIdx)"
                  title="Присоединиться"
                  @click="joinEvent"
                  append-icon="mdi-login"
                ></v-list-item>
                <template v-else>
                  <v-list-item
                    title="Изменить себя"
                    @click="joinEvent"
                    append-icon="mdi-pencil"
                  ></v-list-item>
                  <v-divider></v-divider>
                  <v-list-item
                    title="Покинуть событие"
                    @click="this.$emit('delMe')"
                    class="text-red"
                    append-icon="mdi-logout"
                  ></v-list-item>
                </template>
              </v-list>
            </v-menu>
          </template>
        </v-text-field>
      </template>

      <template v-slot:item="{ item, index }">
        <tr @click="editMember(item, index, $event)">
          <td>{{ index + 1 }}</td>
          <td>
            <user-contacts-card :member="item"></user-contacts-card>
          </td>
          <td>{{ item.days_amount }}</td>
          <td>
            <v-icon v-if="item.is_drinker" icon="mdi-checkbox-marked" color="success"></v-icon>
            <v-icon v-else icon="mdi-close-box" color="red"></v-icon>
          </td>
          <td>
            <v-icon v-if="item.is_involved" icon="mdi-checkbox-marked" color="success"></v-icon>
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
      </template>

      <template v-slot:bottom></template>
    </v-data-table>

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

    <v-confirm-dialog ref="confirm" />
  </v-container>
</template>

<script>
import EventMemberForm from '@/components/Forms/EventMemberForm.vue'
import EventMemberMoneyForm from '@/components/Forms/EventMemberMoneyForm.vue'
import UserContactsCard from '@/components/Cards/UserContactsCard.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useEventMemberStore } from '@/stores/eventMemberStore'

export default {
  name: 'tab-members',
  components: { EventMemberForm, EventMemberMoneyForm, UserContactsCard },
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
      sellectedMemberIdx: NaN,
      search: '',
      sortBy: [
        { key: 'role', order: 'desc' },
        { key: 'user', order: 'desc' }
      ],
      headers: [
        { title: '#', key: '', sortable: false },
        { title: 'Ник', key: 'nickname' },
        { title: 'число дней', key: 'days_amount' },
        { title: 'пьет', key: 'is_drinker' },
        { title: 'приедет', key: 'is_involved' },
        { title: 'Действия', key: 'actions', sortable: false }
      ]
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
        this.delMember(member)
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
    async delMember(member) {
      if (
        await this.$refs.confirm.open(
          'Подтвердите удаление участника',
          'Вы уверены что хотите удалить участника события?'
        )
      ) {
        this.$emit('delMember', member)
      }
    },

    joinEvent() {
      if (!this.currentUserStore.isAuth) {
        this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } })
      }
      this.sellectedMemberIdx = NaN
      this.dialogMode = 'join'
      this.dialogVisible = true
    },
    editMe() {
      this.sellectedMemberIdx = this.meMemberIdx
      this.dialogMode = 'editMe'
      this.dialogVisible = true
    },
    addMember() {
      this.sellectedMemberIdx = NaN
      this.dialogMode = 'add'
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
    },
    tableHeaders() {
      if (!this.canEdit) {
        return this.headers.slice(0, -1)
      }
      return this.headers
    }
  },
  mounted() {
    this.$emit('getMembers')
  }
}
</script>
