import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import VueClipBoard from 'vue-clipboard2'
import Element, { Message, MessageBox } from 'element-ui'
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
import { hasOperate } from '@/utils/listening'
import routerMixin from '@/router/routerMixin'
Vue.mixin(routerMixin)
Vue.use(CKEditor)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
})
Vue.use(VueClipBoard)
Vue.prototype.$EventBus = new Vue()
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
Object.defineProperties(Vue.prototype, {
  FILE_URL_IMG_NAME: {
    value: function (fileName) {
      if (!fileName) {
        return
      }
      const [fileId, ext] = fileName.split('.')
      return (
        process.env.VUE_APP_REMOTE_URL +
        'mi/api/v1/file/downloadBuiltIn' +
        toQueryString({ token: getToken(), fileId, ext })
      )
    },
  },
})
Vue.prototype.$message = message
Vue.config.productionTip = false
Vue.prototype.AGORA_APPID = 'ffe8c1cf7d284b559b65b7891cb879ae'

authGuard()
const Base64 = require('js-base64').Base64
window.vm = new Vue({
  router,
  store,
  Base64,
  render: h => h(App),
}).$mount('#app')

for (var i = 1; i < 100; i++) {
  clearInterval(i)
}
document.body.removeEventListener('mouseover', () => {})
//监听操作
hasOperate(1800000, async () => {
  if (new RegExp('/login').test(location.href)) return //登录页面不监听
  await store.dispatch('user/logout')
  const confirm = await MessageBox({
    title: '提示',
    message: '长时间未操作，已为您退出登录，请重新登录！',
    type: 'warning',
    showClose: false,
    showCancelButton: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
  if (confirm !== 'confirm') return
  setTimeout(() => {
    router.push(`/login`)
  }, 300)
})
