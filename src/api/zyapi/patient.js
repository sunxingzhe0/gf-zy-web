import request from '@/utils/request'
// 获取黑名单列表
export function blackList(params) {
  return request({
    url: 'zyapi/api/v1/patient/blackList',
    method: 'get',
    params,
  })
}
// 移除黑名单
export function removeBlackList(data) {
  return request({
    url: 'zyapi/api/v1/patient/removeBlackList',
    method: 'post',
    data,
  })
}
