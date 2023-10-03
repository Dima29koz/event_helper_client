<template>
  <div class="container">
    <table class="table table-hover caption-top">
      <caption>
        <div class="d-flex justify-content-between">
          <h1>Участники:</h1>
          <button
            type="button"
            class="btn btn-success"
            @click="(sellectedMemberIdx = NaN), (dialogVisible = true)"
          >
            Добавить
          </button>
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
          <th scope="col">Удалить</th>
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
          <td><button class="btn btn-outline-danger" name="delete-member">x</button></td>
        </tr>
      </tbody>
    </table>

    <b-modal
      v-if="dialogVisible"
      :title="sellectedMember() === null ? 'Добавление участника' : 'Изменение участника'"
      :size="'modal-lg'"
      @close="dialogVisible = false"
      ref="modalElem"
    >
      <template #body>
        <event-member-form
          id="memberForm"
          :member_data="sellectedMember()"
          :onSubmit="sellectedMember() === null ? onAddMember : onEditMember"
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

export default {
  name: 'tab-members',
  components: { EventMemberForm },
  data() {
    return {
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
      this.dialogVisible = true
    },

    onAddMember(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('addMember', member_data)
    },
    onEditMember(member_data) {
      this.$refs.modalElem.modal.hide()
      this.$emit('editMember', member_data)
    }
  }
}
</script>
