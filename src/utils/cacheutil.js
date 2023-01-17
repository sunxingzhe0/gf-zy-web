/* cookie -- */
//设置
export function setCookie() {
  var Days = 30
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
}
//获取
export function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}
//删除
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}
//清除
export function clearAllCookie() {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  var keys = document.cookie.match(/[^ =;]+(?==)/g)
  console.log('需要删除的cookie名字：' + keys)
  if (keys) {
    for (var i = keys.length; i--; )
      document.cookie =
        keys[i] + '=0; expire=' + date.toGMTString() + '; path=/'
  }
}

/* local--- */
export function setStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}
export function getStorage(name) {
  return JSON.parse(localStorage.getItem(name))
}
export function removeStorage(name) {
  localStorage.removeItem(name)
}
export function clearStorage() {
  localStorage.clear()
}
