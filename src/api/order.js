import request from '@/utils/request'

// --------------------------------药房端订单-----------------------

// 订单列表
export function getOrderList(params) {
  return request({
    url: '/api/v1/order/yf/rpOrderList',
    method: 'get',
    params,
  })
}

// 订单详情
export function orderDetail(params) {
  return request({
    url: '/api/v1/order/yf/rpOrderDetail',
    method: 'get',
    params,
  })
}

// 待核销药品清单
export function toWaitOff(params) {
  return request({
    url: '/api/v1/order/yf/getWaitExpenseInfo',
    method: 'get',
    params,
  })
}

// 核销
export function hxOrder(data) {
  return request({
    url: '/api/v1/order/yf/webPharmacyExpense',
    method: 'post',
    data,
  })
}

// 待发货药品
export function toSend(params) {
  return request({
    url: '/api/v1/order/yf/waitDelivery',
    method: 'get',
    params,
  })
}

// 物流公司列表
export function exList(params) {
  return request({
    url: '/api/v1/express/getExpressCompany',
    method: 'get',
    params,
  })
}

// 确认发货
export function submitEx(data) {
  return request({
    url: '/api/v1/order/yf/delivery',
    method: 'post',
    data,
  })
}

// 更新物流
export function editExpress(data) {
  return request({
    url: '/api/v1/express/update',
    method: 'post',
    data,
  })
}

// --------------------------------机构端订单-----------------------

// 业务订单
export function getBusOrderList(params) {
  return request({
    url: '/api/v1/order/org/list',
    method: 'get',
    params,
  })
}

// 订单详情
export function getOrderDetail(params) {
  return request({
    url: '/api/v1/order/org/webDetail',
    method: 'get',
    params,
  })
}

// 处方订单
export function getRpList(params) {
  return request({
    url: '/api/v1/order/org/rpList',
    method: 'get',
    params,
  })
}

// 处方订单详情
export function rpDetail(params) {
  return request({
    url: '/api/v1/order/org/rpDetail',
    method: 'get',
    params,
  })
}

// 处方管理
export function getRpManage(params) {
  return request({
    url: '/api/v1/prescription/webPageRpList',
    method: 'get',
    params,
  })
}

// 处方管理详情
export function rpManageDetail(params) {
  return request({
    url: '/api/v1/prescription/singleRp',
    method: 'get',
    params,
  })
}
