<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>Участники:</h1>
          <div>
            <button
              v-if="!data.some((e) => e.user === currentUserStore.username)"
              type="button"
              class="btn btn-primary me-2"
              @click="(sellectedMemberIdx = NaN), (dialogMode = 'join'), (dialogVisible = true)"
            >
              Присоединиться
            </button>
            <button
              v-if="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
              type="button"
              class="btn btn-success"
              @click="(sellectedMemberIdx = NaN), (dialogMode = 'add'), (dialogVisible = true)"
            >
              Добавить
            </button>
          </div>
        </div>
      </caption>
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
            <button class="btn btn-outline-danger" name="delete-member">x</button>
          </td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="dialogVisible"
      :title="dialogTitle"
      :size="'modal-lg'"
      @close="dialogVisible = false"
      ref="modalElem"
    >
      <template #body>
        <event-member-form
          id="memberForm"
          :member_data="sellectedMember()"
          v-model:mode="dialogMode"
          :is_editable="eventMemberStore.hasOneOfRoles(['organizer', 'creator'])"
          :onSubmit="dialogOnSubmit"
        ></event-member-form>
      </template>
      <template #footer>
        <button type="submit" class="btn btn-primary" form="memberForm">Сохранить</button>
      </template>
    </b-modal>
  </div>
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
      this.dialogMode = undefined
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
    }
  },
  computed: {
    dialogTitle() {
      if (this.sellectedMember() === null) {
        return this.dialogMode == 'add' ? 'Добавление участника' : 'Присоединиться'
      }
      return 'Изменение участника'
    },
    dialogOnSubmit() {
      if (this.sellectedMember() === null) {
        return this.dialogMode == 'add' ? this.onAddMember : this.onJoinEvent
      }
      return this.onEditMember
    }
  }
}
</script>
