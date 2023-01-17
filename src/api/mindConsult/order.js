import request from '@/utils/request'
import downloadFile from '@/utils/download-file'

/**
 * 预约单列表
 * @param {object} params
 */
export function queryReservation(data) {
  return request({
    url: `/api/v1/counseling/reservation/queryReservation`,
    method: 'post',
    data,
  })
}

/**
 * 预约单详情
 * @param {object} params
 */
export function queryReservationDetail(params) {
  return request({
    url: `/api/v1/counseling/reservation/queryReservationDetail/${params.reservationId}`,
    method: 'get',
    params,
  })
}

/**
 * 导出预约单
 * @param {object} params
 */
export function exportExcel(params) {
  return downloadFile({
    url: `/api/v1/counseling/reservation/exportExcel`,
    method: 'get',
    params,
  })
}

/**
 * 心咨订单
 * @param {object} params
 */
export function orderList(params) {
  return request({
    url: `/api/v1/counseling/order/orderList`,
    method: 'get',
    params,
  })
}
/**
 * 心咨后台订单
 * @param {object} params
 */
export function toPayList(params) {
  return request({
    url: `/api/v1/counseling/order/toPayList`,
    method: 'get',
    params,
  })
}
/**
 * 心咨后台订单-关闭
 * @param {object} params
 */
export function closePay(data) {
  return request({
    url: `/api/v1/counseling/order/closePay/${data.id}`,
    method: 'post',
    data,
  })
}
/**
 * 心咨订单统计接口
 * @param {object} params
 */
export function orderCount(params) {
  return request({
    url: `/api/v1/counseling/order/orderCount`,
    method: 'get',
    params,
  })
}
/**
 * 导出订单
 * @param {object} params
 */
export function recordExport(params) {
  return downloadFile({
    url: `/api/v1/counseling/order/recordExport`,
    method: 'get',
    params,
  })
}
