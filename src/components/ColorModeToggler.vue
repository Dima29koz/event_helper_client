<template>
  <div class="d-flex align-items-center ms-2">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" id="bd-theme">
          <v-icon :icon="currentThemeIcon" class="bi"></v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="onClick('light')">
          <v-icon icon="mdi-white-balance-sunny" class="bi"></v-icon>
          Light
          <v-icon icon="mdi-check" class="bi ms-auto d-none"></v-icon>
        </v-list-item>
        <v-list-item @click="onClick('dark')">
          <v-icon icon="mdi-weather-night" class="bi"></v-icon>
          Dark
          <v-icon icon="mdi-check" class="bi ms-auto d-none"></v-icon>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
        <v-list-item @click="onClick('auto')">
          <v-icon icon="mdi-circle-half-full" class="bi"></v-icon>
          Auto
          <v-icon icon="mdi-check" class="bi ms-auto d-none"></v-icon>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  setup() {
    const theme = useTheme()
    const themes = {
      auto: 'mdi-circle-half-full',
      dark: 'mdi-weather-night',
      light: 'mdi-white-balance-sunny'
    }
    return { theme, themes }
  },
  data() {
    return {
      currentTheme: 'light'
    }
  },
  methods: {
    getStoredTheme() {
      return localStorage.getItem('theme')
    },
    setStoredTheme(theme) {
      return localStorage.setItem('theme', theme)
    },
    getPreferredTheme() {
      const storedTheme = this.getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }

      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    },
    setTheme(theme) {
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme.global.name.value = 'dark'
        this.currentTheme = 'auto'
      } else {
        this.theme.global.name.value = theme === 'auto' ? 'light' : theme
        this.currentTheme = theme
      }
    },
    onClick(theme) {
      this.setStoredTheme(theme)
      this.setTheme(theme)
    }
  },
  computed: {
    currentThemeIcon() {
      return this.themes[this.currentTheme]
    }
  },
  mounted() {
    this.setTheme(this.getPreferredTheme())

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = this.getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        this.setTheme(this.getPreferredTheme())
      }
    })
  }
}
</script>

<style scoped>
.bi {
  width: 1em;
  height: 1em;
  fill: currentcolor;
  color: currentcolor;
}
.active {
  font-weight: 600;
}
.active .bi {
  display: block !important;
}
</style>
