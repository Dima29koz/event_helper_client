<template>
  <v-tooltip location="bottom" v-model="showTooltip">
    <template v-slot:activator="{ props }">
      <div v-bind="props" @click="showTooltip = !showTooltip">
        <slot name="activator"><v-icon :icon="icon"></v-icon></slot>
      </div>
    </template>
    <slot></slot>
  </v-tooltip>
</template>

<script>
export default {
  name: 'v-switchable-tooltip',
  data() {
    return {
      showTooltip: false
    }
  },
  props: {
    icon: { type: String, default: 'mdi-help-circle-outline' }
  }
}
</script>
