export function hasOperate(second, callback) {
  // console.log('进入----------')
  // if (window.location.hash.split('?')[0] === '#/login') return
  let nowTime = new Date().getTime()
  let startTime = new Date().getTime()
  document.body.addEventListener('mouseover', () => {
    startTime = new Date().getTime()
    // console.log(startTime)
  })

  let timer = setInterval(function () {
    nowTime = new Date().getTime()
    // console.log(nowTime - startTime, '时间差')
    if (nowTime - startTime < second) return
    if (nowTime - startTime > second) {
      callback()
      clearInterval(timer)
      document.body.removeEventListener('mouseover', () => {})
    }
  }, 1000)
}
