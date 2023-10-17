<template>
  <div class="h-100 d-flex flex-column">
    <v-spacer></v-spacer>
    <div class="align-end">
      <v-footer class="text-center d-flex flex-column" :elevation="20">
        <h4>Связаться с нами</h4>
        <div>
          <v-spacer></v-spacer>
          <v-btn class="mx-4" variant="text" :href="icons.discord" target="_blank" icon>
            <v-icon><IconDiscord></IconDiscord></v-icon>
          </v-btn>
        </div>

        <div class="px-4 py-2 text-center w-100">
          {{ new Date().getFullYear() }} — <strong>EventHelper Team</strong>
        </div>
      </v-footer>
    </div>
  </div>
</template>

<script>
import IconDiscord from '@/components/icons/IconDiscord.vue'
export default {
  name: 'home-view',
  components: { IconDiscord },
  data() {
    return {
      icons: { discord: 'https://discord.gg/MJvvSudxGV' }
    }
  }
}
</script>

<style scoped></style>
