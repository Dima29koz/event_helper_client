import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import directives from '@/directives'
import components from '@/components/UI';
import store from './store'
import VueCookies from 'vue-cookies'

const app = createApp(App)


components.forEach(component => {
    app.component(component.name, component)
})

directives.forEach(directive => {
    app.directive(directive.name, directive)
})

app.use(store).use(router).use(VueCookies).mount('#app')
