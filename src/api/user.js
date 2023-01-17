import request from '@/utils/request'
// import { toQueryString } from '@/utils'

export function login(data) {
  return request({
    url: '/api/v1/login/webLogin',
    method: 'post',
    data,
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/login/loginInfo',
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/api/v1/login/logOut',
    method: 'get',
  })
}

export function getRoles(params) {
  return request({
    url: '/api/v1/login/menuList',
    method: 'get',
    params,
  })
}

/**
 * 根据用户名获取验证图片 建议在用户输入完用户名 光标转移到密码之后就可以获取
 * @param {object} params
 * @param {string} params.username - 登录用户用户名
 * @returns {string} 图片地址
 */
export function humanValidate(params) {
  // if (!params.username) {
  //   throw new Error(`params.username: ${params.username}`)
  // }
  return request({
    url: '/api/v1/login/humanValidate',
    method: 'get',
    params,
  })
  // return (
  //   process.env.VUE_APP_REMOTE_URL +
  //   '/api/v1/login/humanValidate' +
  //   toQueryString({ ...params, t: new Date().getTime() })
  // )
}
/*
@name          codeLogin
@desc          门户跨系统登录
@params        {
                    "code":"6ql5so75fpzi",
                    "type":[
                        "DOC_WEB",
                        "ORG_WEB",
                        "DRUG_STORE",
                        "DRUG_DOC"
                    ]
                }
@return        
*/
export function codeLogin(params) {
  return request({
    url: '/api/v1/login/mhLogin',
    method: 'post',
    data: params,
  })
}

//获取签名二维码code
export function generateCodeMark(params) {
  return request({
    url: '/api/v1/cloud/generateCodeMark',
    method: 'get',
    params,
  })
}

//轮询二维码扫描结果
export function pollingMonitor(params) {
  return request({
    url: '/api/v1/cloud/pollingMonitor',
    method: 'get',
    params,
  })
}
