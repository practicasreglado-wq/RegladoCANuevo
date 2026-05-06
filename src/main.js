import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { vReveal } from './composables/useReveal'
import './assets/css/main.css'
import 'flag-icons/css/flag-icons.min.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('reveal', vReveal)
app.mount('#app')
