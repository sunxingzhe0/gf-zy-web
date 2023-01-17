import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Socket from '@/components/Socket'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/appointment'] // no redirect whitelist

Message.info = function (msg) {
  Message({
    message: msg,
    showClose: true,
  })
}
Message.warning = function (msg) {
  Message({
    message: msg,
    type: 'warning',
    showClose: true,
  })
}
Message.error = function (msg) {
  Message({
    message: msg,
    type: 'error',
    showClose: true,
  })
}
Message.success = function (msg) {
  Message({
    message: msg,
    type: 'success',
    showClose: true,
  })
}

const getUrlParams = function () {
  const url = decodeURIComponent(window.location.href)
  const index = url.indexOf('?')
  const params = {}
  if (index !== -1) {
    let queryStr = url.substring(index + 1)
    const hashIndex = queryStr.indexOf('#')
    if (hashIndex !== -1) {
      queryStr = queryStr.substring(0, hashIndex)
    }
    queryStr.split('&').forEach(item => {
      const arr = item.split('=')
      params[arr[0]] = arr[1]
    })
  }
  return params
}

const genGetPath = function (item) {
  let path = /^\//.test(item.path) ? '' : '/'
  path = path + item.path
  if (item.children && item.children.length) {
    path = path + genGetPath(item.children[0])
  }
  return path
}

export const authGuard = async function () {
  let asyncRoutes = []
  let appointment = false
  let params = getUrlParams()
  if (params.code) {
    await store.dispatch('user/codeLogin', params)
    // if (!store.getters.modifyPwd) {
    await store.dispatch('user/getInfo')
    // }
    location.href = '/'
  }
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    const hasToken = getToken()
    // set page title
    document.title = getPageTitle(to.meta.title)
    // 优先检查code
    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        // console.log(hasRoles)
        if (hasRoles) {
          if (to.path === '/404') {
            try {
              let root = from.path.match(/\/.*?\//)[0]
              root = root.substring(0, root.length - 1)
              let route = asyncRoutes.find(item => item.path === root)
              if (route) {
                const path = genGetPath(route)
                next(path)
              } else {
                next()
              }
            } catch (e) {
              next()
            }
          } else {
            next()
          }
        } else {
          try {
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']

            store.dispatch('user/getInfo').then(() => {
              if (!store.getters.modifyPwd) {
                Socket().connect()
              }
            })
            const [roles] = await Promise.all([store.dispatch('user/getRoles')])

            // generate accessible routes map based on roles
            // console.log(asyncRoutes, '用户角色-----------------------')
            //密码长时间未更改限制路由权限
            const isOutTimeRoles = [
              'DOC_WEB_SET_UP',
              // 'DRUG_STORE_SET_UP',
              // 'ORG_WEB_SET_UP',
              // 'DRUG_DOC',
              'ZY_ORG_SETTING',
              'DOC_WEB_SET_UP_PERSONAL_INFORMATION',
              'DRUG_DOC_SET_UP_PERSONAL_INFORMATION',
              'DRUG_STORE_SET_UP_PERSONAL_INFORMATION',
              'DRUG_DOC_SET_UP_PERSONAL_INFORMATION',
              'ORG_WEB_SET_UP_PERSONAL_INFORMATION',
            ]

            // console.log(roles, '角色=====')
            asyncRoutes = await store.dispatch(
              'permission/generateRoutes',
              store.getters.modifyPwd ? isOutTimeRoles : roles,
            )

            // dynamically add accessible routes
            router.addRoutes(asyncRoutes)
            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            console.log(error)
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            // Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/
      const reg = new RegExp('^(' + whiteList.join('|') + ')')
      if (reg.test(to.path)) {
        if (/^\/appointment/.test(to.path) && !appointment) {
          asyncRoutes = await store.dispatch('permission/appointmentMenu')
          router.addRoutes(asyncRoutes)
          let path = asyncRoutes[0]?.children[0]?.path
          if (path) {
            next({ ...to, path: '/appointment/' + path, replace: true })
          }
          appointment = true

          return
        }
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })
}
