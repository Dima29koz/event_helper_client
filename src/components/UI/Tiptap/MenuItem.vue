<template>
  <v-btn @click="action" :title="title" :value="title" :icon="icon"> </v-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    action: {
      type: Function,
      required: true
    },

    isActive: {
      type: Function,
      default: () => false
    }
  }
}
</script>
