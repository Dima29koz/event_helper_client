<template>
  <div class="d-flex" style="min-width: 10rem; max-width: 10rem">
    <v-text-field
      v-if="editedValue !== undefined"
      id="valueInput"
      v-model.number="editedValue"
      @keyup.enter="submit"
      @keyup.esc="discard"
      v-click-outside="discard"
      :type="type"
      variant="outlined"
      single-line
      :hide-details="true"
      density="compact"
      :autofocus="true"
    >
      <template v-slot:append-inner>
        <v-btn @click="submit" density="compact" name="edit-product" variant="plain" icon>
          <v-icon icon="mdi-check" color="success"></v-icon>
        </v-btn>
        <v-btn @click="discard" density="compact" name="edit-product" variant="plain" icon>
          <v-icon icon="mdi-cancel" color="red"></v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-chip v-else @click="editedValue = value" label class="flex-1-1-100" :class="justifyClass">
      {{ formatter(value) }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'v-editable-field',
  data() {
    return {
      editedValue: undefined,
      isEdit: false,
      justifyClass: this.type === 'number' ? 'justify-end' : 'justify-center'
    }
  },
  props: {
    value: null,
    formatter: {
      type: Function,
      default: (v) => v
    },
    type: { default: 'text' }
  },
  methods: {
    submit() {
      this.$emit(
        'submit',
        this.type === 'number' ? Number(this.editedValue) : String(this.editedValue)
      )
      this.editedValue = undefined
    },
    discard() {
      this.editedValue = undefined
    }
  }
}
</script>
