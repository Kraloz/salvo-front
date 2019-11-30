import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { ApiService } from './services/api.service'
import {TokenService} from './services/storage.service'

import '@/assets/css/tailwind.css'

Vue.config.productionTip = false

ApiService.init(process.env.VUE_APP_ROOT_API)

// If token exists set header
if (TokenService.getToken()) {
  ApiService.setHeader()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
