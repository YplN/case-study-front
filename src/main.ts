import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
// Router imports
import router from './router'
// Axios imports
import axios from 'axios'
import VueAxios from 'vue-axios'
// UUID imports
import withUUID from 'vue-uuid'

// Toast imports
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'

const app = withUUID(createApp(App))
app.use(router)
app.use(VueAxios, axios)
app.use(ToastPlugin, {
  position: 'top',
  dismissible: true
})

app.mount('#app')
