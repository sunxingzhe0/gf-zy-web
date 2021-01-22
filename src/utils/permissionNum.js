import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function permissionNum(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    let hasPermission = []
    roles.forEach(role => {
      permissionRoles.forEach(item => {
        if (role == item) {
          hasPermission.push(item)
        }
      })
    })
    console.log(value, hasPermission.length)

    return hasPermission.length
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return 0
  }
}
