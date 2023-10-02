<template>
  <div>
    <h4>Участники:</h4>
    <div v-for="(member, index) in data" :key="index">
      {{ member }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab-members',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>
