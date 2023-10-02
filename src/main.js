// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import directives from '@/directives'
import components from '@/components/UI'
import VueCookies from 'vue-cookies'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App)

components.forEach((component) => {
  app.component(component.name, component)
})
app.component('VueDatePicker', VueDatePicker)

directives.forEach((directive) => {
  app.directive(directive.name, directive)
})

app.use(createPinia())
app.use(router)
app.use(VueCookies)

app.mount('#app')
