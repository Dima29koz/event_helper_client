<template>
  <v-tooltip location="bottom" v-model="showTooltip">
    <template v-slot:activator="{ props }">
      <v-icon
        v-bind="props"
        @click="showTooltip = !showTooltip"
        icon="mdi-help-circle-outline"
      ></v-icon>
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
  }
}
</script>
