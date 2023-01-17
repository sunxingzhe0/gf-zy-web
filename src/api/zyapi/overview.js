import request from '@/utils/request'
// 获取挂号统计
export function viewDataCount(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/viewDataCount',
    method: 'get',
    params,
  })
}

// 顶部数据
export function viewTopData(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/viewTopData',
    method: 'get',
    params,
  })
}

// 概览统计图
export function viewPayData(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/viewPayData',
    method: 'get',
    params,
  })
}
