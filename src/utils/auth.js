import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const zytokenkey = 'zy-token'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getzyToken() {
  return Cookies.get(zytokenkey)
}

export function setzyToken(token) {
  return Cookies.set(zytokenkey, token)
}

export function removezyToken() {
  return Cookies.remove(zytokenkey)
}
