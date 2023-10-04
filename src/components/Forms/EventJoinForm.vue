<template>
  <form @submit.prevent="this.onSubmit(this.key)">
    <div class="form-floating">
      <input
        v-focus
        v-model="key"
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="Ключ события"
      />
      <label for="floatingInput">Ключ события</label>
    </div>
  </form>
</template>

<script>
export default {
  name: 'event-join-form',
  data() {
    return {
      key: ''
    }
  },
  props: {
    onSubmit: {
      type: Function,
      default: null
    }
  }
}
</script>
