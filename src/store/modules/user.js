import {
  getToken,
  setToken,
  getzyToken,
  setzyToken,
  removeToken,
  removezyToken,
} from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'
import { traverseTree } from '@/utils'
import { clearAllCookie, setStorage, getStorage } from '@/utils/cacheutil'
import router, { resetRouter } from '@/router'
import { login, logout, getInfo, getRoles, codeLogin } from '@/api/user'
import CryptoJS from 'crypto-js'
const state = {
  modifyPwd: getStorage('modifyPwd') || '',
  token: getToken(),
  zyToken: getzyToken(),
  name: '',
  logo: '',
  avatar: '',
  introduction: '',
  roles: [],
  userId: '',
  socketToken: '',
  orgName: '',
  orgId: '',
  dept: {
    list: [],
    id: '',
    name: '',
  },
  store: {
    list: [],
    id: '',
    name: '',
  },
  platform: '',
  title: '',
  titleId: '',
  account: '',
  phone: '',
  roleName: '',
  roleList: [],
  workHistroy: '',
  workNo: '',
  hasExamine: '',
  hasAuth: '',
  platformCode: '',
  //账户角色列表
  userTypeList: [],
  keepLiveList: [], //缓存路由name
}

const mutations = {
  SET_LOGO: (state, logo) => {
    state.logo = logo
  },
  SET_MAIL: (state, mail) => {
    state.mail = mail
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ZYTOKEN: (state, token) => {
    state.zyToken = token
  },
  SET_PWDSTATE: (state, modifyPwd) => {
    state.modifyPwd = modifyPwd
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_SOCKET_TOKEN: (state, socketToken) => {
    state.socketToken = socketToken
  },
  SET_ORG_NAME: (state, orgName) => {
    state.orgName = orgName
  },
  SET_ORG_ID: (state, orgId) => {
    state.orgId = orgId
  },
  SET_DEPT: (state, dept) => {
    state.dept = dept
  },
  SET_DEFAULT_DEPT: (state, dept) => {
    state.dept.id = dept.id
    state.dept.name = dept.name
  },
  SET_STORE: (state, store) => {
    state.store = store
  },
  SET_DEFAULT_STORE: (state, store) => {
    state.store.id = store.id
    state.store.name = store.name
  },
  SET_PLATFORM: (state, platform) => {
    state.platform = platform
  },
  SET_PLATFORM_CODE(state, plylod) {
    state.platformCode = plylod
  },
  SET_TITLE: (state, title) => {
    state.title = title
  },
  SET_TITLE_ID: (state, titleId) => {
    state.titleId = titleId
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_IDENT: (state, identityType) => {
    state.identityType = identityType
  },

  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_ROLELIST: (state, roleList) => {
    state.roleList = roleList
  },
  SET_WORKHISTORY: (state, workHistory) => {
    state.workHistory = workHistory
  },
  SET_WORKNO: (state, workNo) => {
    state.workNo = workNo
  },
  SET_HASEXAMINE: (state, hasExamine) => {
    state.hasExamine = hasExamine
  },
  SET_HASAUTH: (state, hasAuth) => {
    state.hasAuth = hasAuth
  },
  SET_YF: (state, YF) => {
    state.YF = YF
  },
  SET_USERTYPE: (state, userTypeList) => {
    state.userTypeList = userTypeList
  },
  SET_KEEPLIVELIST: (state, data) => {
    state.keepLiveList = data
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password, code, imgCode } = userInfo
    return new Promise((reslove, reject) => {
      login({
        account: account.trim(),
        password: CryptoJS.MD5(password).toString(),
        // password: password,
        code,
        imgCode,
      })
        .then(async response => {
          const { token, zyToken, modifyPwd } = response
          commit('SET_TOKEN', token)
          commit('SET_ZYTOKEN', zyToken)
          commit('SET_PWDSTATE', modifyPwd)
          setStorage('modifyPwd', modifyPwd)
          setToken(token)
          setzyToken(zyToken)

          if (modifyPwd) {
            const confirm = await MessageBox({
              title: '提示',
              message:
                '您已经长时间未更新密码了，为了您的账户安全请及时更新密码！',
              type: 'warning',
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
            })

            if (confirm !== 'confirm') return
            commit('SET_ACCOUNT', response.account)
            commit('SET_ROLENAME', response.roleName)
            commit('SET_ROLELIST', response.roleList)
            setTimeout(() => {
              //延时跳转，先关闭模态框
              reslove()
            }, 500)
            return
          }
          reslove()
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  codeLogin({ commit }, paylod) {
    return new Promise((reslove, reject) => {
      codeLogin(paylod)
        .then(async res => {
          const { token, zyToken, modifyPwd } = res
          commit('SET_ZYTOKEN', zyToken)
          commit('SET_TOKEN', token)
          commit('SET_PWDSTATE', modifyPwd)
          setStorage('modifyPwd', modifyPwd)
          setzyToken(zyToken)
          setToken(token)
          if (modifyPwd) {
            const confirm = await MessageBox({
              title: '提示',
              message:
                '您已经长时间未更新密码了，为了您的账户安全请及时更新密码！',
              type: 'warning',
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              dangerouslyUseHTMLString: true,
              distinguishCancelAndClose: true,
            })
            if (confirm !== 'confirm') return
            commit('SET_ACCOUNT', res.account)
            commit('SET_ROLENAME', res.roleName)
            commit('SET_ROLELIST', res.roleList)
            setTimeout(() => {
              //延时跳转，先关闭模态框
              reslove()
            }, 500)
            return
          }
          reslove()
        })
        .catch(e => {
          Message({
            type: 'error',
            message: e.Message,
          })
          setTimeout(() => {
            window.close()
            reject(e)
          }, 1500)
        })
    })
  },
  // get user info
  getInfo({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(data => {
          if (!data) {
            reject('Verification failed, please Login again.')
          }

          commit('SET_LOGO', data.logo)
          commit('SET_PWDSTATE', data.modifyPwd)
          commit('SET_MAIL', data.mail)
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.avatar)
          /* commit('SET_INTRODUCTION', data.introduction) */
          commit('SET_SOCKET_TOKEN', data.imToken)
          commit('SET_USERID', data.userId)
          commit('SET_YF', data.storeList?.[0]?.id)

          commit('SET_ORG_NAME', data.orgName)
          commit('SET_ORG_ID', data.orgId)
          commit('SET_DEPT', {
            list: data.deptList,
            id: data.deptId,
            name: data.deptName,
          })
          // console.log(router)
          commit('SET_STORE', {
            list: data.storeList ?? [],
            id: data.storeList?.[0]?.id,
            name: data.storeList?.[0]?.name,
          })
          commit('SET_PLATFORM', data.clientType)
          commit('SET_PLATFORM_CODE', data.platOrgId)
          commit('SET_TITLE', data.titleName)
          commit('SET_TITLE_ID', data.titleId)
          commit('SET_ACCOUNT', data.account)
          commit('SET_IDENT', data.identityType)
          commit('SET_PHONE', data.phone)
          localStorage.setItem('orgphone', data.phone)
          commit('SET_ROLENAME', data.roleName)
          commit('SET_ROLELIST', data.roleList)
          commit('SET_WORKHISTORY', data.workHistory)
          commit('SET_WORKNO', data.workNo)
          commit('SET_HASEXAMINE', data.hasExamine)
          commit('SET_HASAUTH', data.hasAuth)
          if (!data.modifyPwd) {
            dispatch('drug/init', null, { root: true })
          }
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  getRoles({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoles({ joinMode: true })
        .then(data => {
          const prefix = []
          let roles = traverseTree(data, 'next', children => {
            if (children.parent) {
              const index = prefix.indexOf(children.parent.value)
              if (index === -1) prefix.push(children.parent.value)
              else if (index !== prefix.length - 1)
                prefix.splice(index + 1, prefix.length - index)
            } else {
              prefix.splice(0, prefix.length)
            }

            return [...prefix, children.value].join('_')
          })
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            // reject('getInfo: roles must be a non-null array!')
            roles = []
          }
          commit('SET_ROLES', roles)
          //保存用户角色列表
          commit('SET_USERTYPE', data)
          resolve(state.roles)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  // occupied 账号是否被占用
  async logout({ commit, state, dispatch }, occupied = false) {
    if (occupied) {
      commit('SET_TOKEN', '')
      commit('SET_SOCKET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
    } else {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(async () => {
            commit('SET_TOKEN', '')
            commit('SET_ZYTOKEN', '')
            commit('SET_SOCKET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            removezyToken()
            resetRouter()
            clearAllCookie()
            // clearStorage()
            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })

            resolve()
            for (var i = 1; i < 100; i++) {
              clearInterval(i)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ZYTOKEN', '')
      commit('SET_SOCKET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removezyToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    /* eslint-disable-next-line no-async-promise-executor */
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true,
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },
  addKeepLive({ state, commit }, paylod) {
    if (!state.keepLiveList.includes(paylod)) {
      state.keepLiveList.push(paylod)
      commit('SET_KEEPLIVELIST', state.keepLiveList)
    }
  },
  removeKeepLive({ state, commit }, paylod) {
    const data = state.keepLiveList.filter(item => item !== paylod)
    commit('SET_KEEPLIVELIST', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
