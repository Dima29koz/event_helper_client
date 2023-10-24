import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import directives from '@/directives'
import components from '@/components/UI'
import VueCookies from 'vue-cookies'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'

import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

components.forEach((component) => {
  app.component(component.name, component)
})

directives.forEach((directive) => {
  app.directive(directive.name, directive)
})

app.use(createPinia())
app.use(
  createVuetify({
    components: { VDataTable },
    display: {
      mobileBreakpoint: 'sm'
    }
  })
)
app.use(router)
app.use(VueCookies)

app.mount('#app')
