import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getzyToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let token = config.url.indexOf('zyapi') > -1 ? getzyToken() : getToken()
    if (config.url.indexOf('zyapi') > -1) {
      config.baseURL = process.env.VUE_APP_BASE_API + 'mz'
      config.url = config.url.split('zyapi')[1]
    } else {
      config.baseURL = process.env.VUE_APP_BASE_API + 'mi'
    }
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['X-Token'] = getToken()
      config.params = {
        ...config.params,
        token: config.params?.token || token,
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.config.responseType === 'blob') return response
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.state !== true) {
      const [code, message] = res.message.split(':')

      Message({
        message: message || 'Error',
        type: 'error',
        duration: 5 * 1000,
        showClose: true,
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (code === 'AUTHORITY-USER-INFO-ERROR-01') {
        // to re-login
        MessageBox.confirm('您已注销，可以留在此页，或重新登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '留在此页',
          type: 'warning',
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.body
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: [
        'timeout of 5000ms exceeded',
        'Network Error',
        'Request failed with status code 404',
      ].includes(error.message)
        ? '网络错误，请稍后再试'
        : error.message == 'Request failed with status code 400'
        ? '请求参数出错'
        : error.message,
      type: 'error',
      duration: 8 * 1000,
      showClose: true,
    })
    return Promise.reject(error)
  },
)

export default service
