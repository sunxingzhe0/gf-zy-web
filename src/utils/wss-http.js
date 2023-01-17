const wss_urls = {
  dev: 'wss://miapp.chuntaoyisheng.com/chat',
  jwtest: 'wss://miapp.chuntaoyisheng.com/chat',
  jwpro: 'wss://hlw.cqsjwzx.com/chat',
}
const access_urls = {
  dev: 'https://miapp.chuntaoyisheng.com',
  jwtest: 'https://miapp.chuntaoyisheng.com',
  jwpro: 'https://hlw.cqsjwzx.com',
}
//判断是否为内网环境替换socket地址
const reg = new RegExp('http://192.168.10.127:10003')
console.log('【当前url】', window.location.href)
export const wss_url = reg.test(window.location.href)
  ? 'ws://192.168.10.127:10003/chat'
  : wss_urls[process.env.MODE]
export const access_url = access_urls[process.env.MODE]
