import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 找到第一个完整路径
 * @param {array} routes
 * @param {string} filterKey
 * @param {string} res
 * @returns {string}
 */
function getRedirect(routes, filterKey = '', res = []) {
  for (let i = 0; i < routes.length; i++) {
    if (filterKey && routes[filterKey]) continue
    if (routes[i].path.indexOf(':') !== -1) continue
    res.push(routes[i].path)
    const hasChildren = routes[i].children && routes[i].children.length > 0
    if (hasChildren) {
      getRedirect(routes[i].children, filterKey, res)
    }
    break
  }
  return res.join('/').replace(/\/\//g, '/')
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }

      // 处理首页 重定向问题
      const rootRoute = accessedRoutes.find(_ => _.path === '/')
      if (rootRoute) {
        rootRoute.redirect = getRedirect(accessedRoutes, 'hidden')
      } else {
        accessedRoutes.unshift({
          path: '/',
          redirect: getRedirect(accessedRoutes, 'hidden'),
        })
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
