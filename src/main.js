import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import VueClipBoard from 'vue-clipboard2'
import Element, { Message } from 'element-ui'
import CKEditor from '@ckeditor/ckeditor5-vue'

import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App.vue'
import store from './store'
import router from './router'
import * as filters from './filters' // global filters
import { getToken } from '@/utils/auth'
import { toQueryString } from '@/utils'
import { authGuard } from './permission' // permission control

import './icons' // icon
import './directive/drag-size/index'
Vue.use(CKEditor)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})
Vue.use(VueClipBoard)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const message = function (options) {
  let opt = Object.assign(options, { showClose: true })
  Message(opt)
}

message.info = function (msg) {
  Message({
    message: msg,
    showClose: true,
  })
}
message.warning = function (msg) {
  Message({
    message: msg,
    type: 'warning',
    showClose: true,
  })
}
message.error = function (msg) {
  Message({
    message: msg,
    type: 'error',
    showClose: true,
  })
}
message.success = function (msg) {
  Message({
    message: msg,
    type: 'success',
    showClose: true,
  })
}

Object.defineProperties(Vue.prototype, {
  FILE_URL: {
    value: function (fileId) {
      if (!fileId) {
        return
      }
      return (
        process.env.VUE_APP_REMOTE_URL +
        'mi' +
        '/api/v1/file/download' +
        toQueryString({ token: getToken(), fileId })
      )
    },
  },
})
Vue.prototype.$message = message
Vue.config.productionTip = false
Vue.prototype.AGORA_APPID = 'ffe8c1cf7d284b559b65b7891cb879ae'

authGuard()
window.vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
