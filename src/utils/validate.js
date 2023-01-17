/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 密码验证
 * @param {string} str
 * @returns {Boolean}
 */

export function isPassword(str) {
  // const reg = /^[0-9a-zA-Z]{6,18}$/
  // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,16}/
  const reg = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,16}/
  return reg.test(str)
}

/**
 * 账号验证
 * @param {string} str
 */
export function isAccount(str) {
  const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/
  return reg.test(str)
}

/**
 * 手机号码
 * @param {string} str
 */
export function isPhoneNumber(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}

/**
 * 简单的身份证号码验证
 * @param {string} str
 */
export function isIDNumber(str) {
  const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}
/**
 * 根据身份证号得到姓别和精确计算年龄
 */
export function analyzeIDCard(IDCard) {
  var sexAndAge = {}
  //获取用户身份证号码
  var userCard = IDCard
  //如果身份证号码为undefind则返回空
  if (!userCard || !isIDNumber(IDCard)) {
    return sexAndAge
  }
  //获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
    sexAndAge.sex = '男'
  } else {
    sexAndAge.sex = '女'
  }
  //获取出生年月日
  // userCard.substring(6,10) + "-" + userCard.substring(10,12) + "-" + userCard.substring(12,14);
  var yearBirth = userCard.substring(6, 10)
  var monthBirth = userCard.substring(10, 12)
  var dayBirth = userCard.substring(12, 14)
  sexAndAge.birthday = `${yearBirth}-${monthBirth}-${dayBirth}`
  //获取当前年月日并计算年龄
  var myDate = new Date()
  var monthNow = myDate.getMonth() + 1
  var dayNow = myDate.getDay()
  var age = myDate.getFullYear() - yearBirth
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--
  }
  //得到年龄
  sexAndAge.age = age
  //返回性别和年龄
  return sexAndAge
}
