import request from '@/utils/request'

// --------------------------------药房端首页-----------------------

// ----------------工作台------------
// 订单数量
export function getOrderNum(params) {
  return request({
    url: '/api/v1/order/pharmacyCount',
    method: 'get',
    params,
  })
}

// 兑换获取信息
export function getExchangeInfo(params) {
  return request({
    url: '/api/v1/code/getQrCodeInfo',
    method: 'get',
    params,
  })
}

// 兑换获取信息
export function confirmExchange(params) {
  return request({
    url: '/api/v1/order/yf/webExpense',
    method: 'get',
    params,
  })
}

// ----------------核销记录------------
// 核销记录列表
export function getWriteOffList(params) {
  return request({
    url: '/api/v1/expense/list',
    method: 'get',
    params,
  })
}
