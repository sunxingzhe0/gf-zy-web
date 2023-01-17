import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getzyToken } from '@/utils/auth'
let requestNum = 0
let errNum = 0
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
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
      // config.baseURL = process.env.VUE_APP_BASE_API
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
    requestNum = requestNum + 1
    // if the custom code is not 20000, it is judged as an error.
    if (res.state !== true) {
      let megIndex = res.message.indexOf(':')
      const [code, message] = [
        res.message.substring(0, megIndex),
        res.message.substring(megIndex + 1, res.message.length),
      ]
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (code === 'AUTHORITY-USER-INFO-ERROR-01') {
        // to re-login
        let apiurl = ['/api/v1/login/loginInfo', '/api/v1/login/menuList']
        if (
          !apiurl.includes(response.config.url) &&
          requestNum >= 1 &&
          errNum === 0
        ) {
          errNum = errNum + 1
          MessageBox.confirm('您已注销，可以留在此页，或重新登录', '确认注销', {
            confirmButtonText: '重新登录',
            cancelButtonText: '留在此页',
            type: 'warning',
          })
            .then(() => {
              errNum = 0
              store.dispatch('user/resetToken').then(() => {
                location.reload()
              })
            })
            .catch(() => {
              errNum = 0
            })
        }
      } else {
        Message({
          message: message || res.message,
          type: 'error',
          duration: 3 * 1000,
          showClose: true,
        })
      }
      console.log(response)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.body
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: [
        'timeout of 10000ms exceeded',
        'Network Error',
        'Request failed with status code 404',
      ].includes(error.message)
        ? '网络错误，请稍后再试'
        : error.message == 'Request failed with status code 400'
        ? '请求参数出错'
        : error.Error == 'timeout of 10000ms exceeded'
        ? '网络错误，请稍后再试'
        : error.message,
      type: 'error',
      duration: 8 * 1000,
      showClose: true,
    })
    return Promise.reject(error)
  },
)

export default service
