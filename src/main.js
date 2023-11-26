import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import components from '@/components/UI'
import VueCookies from 'vue-cookies'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

components.forEach((component) => {
  app.component(component.name, component)
})

app.use(createPinia())
app.use(
  createVuetify({
    display: {
      mobileBreakpoint: 'sm'
    }
  })
)
app.use(router)
app.use(VueCookies)

app.mount('#app')
