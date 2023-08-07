import './assets/main.css'
import App from '@/App.vue'
import router from './router'
import './router/i18n'
import './router/auth'
import { createHead } from '@unhead/vue'
import { i18n } from '@/i18n'
import { register } from 'swiper/element/bundle'

const app = createApp(App)

const head = createHead()

app.use(i18n)
app.use(head)
app.use(createPinia())
app.use(router)

app.mount('#app')

register()
