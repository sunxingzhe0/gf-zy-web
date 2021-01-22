import request from '@/utils/request'
import downloadFile from '@/utils/download-file'
// 报告查询
export function recordStatistics(params) {
  return request({
    url: 'zyapi/api/v1/record/recordStatistics',
    method: 'get',
    params,
  })
}
/**
 * 预约挂号统计
 * @param {string} timeType 时间条件类型 0.就诊日期/挂号日期
 * @param {string} startTime - 开始时间 (如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} endTime - 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} deptId 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} patientType 就诊类型
 * @param {int} ghType -查询类型 0:预约挂号统计,1:当日挂号统计
 */
export function orderGhData(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/orderGhData',
    method: 'post',
    data,
  })
}

/**
 * 门诊缴费统计
 * @param {string} timeType 时间条件类型 0.就诊日期/挂号日期
 * @param {string} startTime - 开始时间 (如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} endTime - 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} deptId 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} itemType 项目类型
 */
export function mzPayDate(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/mzPayDate',
    method: 'post',
    data,
  })
}

/**
 * 住院缴费的统计
 * @param {string} timeType 时间条件类型 0.缴费日期
 * @param {string} startTime - 开始时间 (如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} endTime - 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} deptId 结束时间(如果是挂号日期,则时间样式为:2020101000000)
 * @param {string} itemType 项目类型
 */
export function zyPayData(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/zyPayData',
    method: 'post',
    data,
  })
}

// 导出挂号记录
export function exportOrderGhData(data) {
  return downloadFile({
    url: 'zyapi/api/v1/reconciliation/exportOrderGhData',
    method: 'post',
    data,
  })
}
// 门诊缴费导出
export function exportMzPayDate(data) {
  return downloadFile({
    url: 'zyapi/api/v1/reconciliation/exportMzPayDate',
    method: 'post',
    data,
  })
}
// 住院缴费导出
export function exportZyPayData(data) {
  return downloadFile({
    url: 'zyapi/api/v1/reconciliation/exportZyPayData',
    method: 'post',
    data,
  })
}

// 导出报告查询统计
export function exportRecord(params) {
  return downloadFile({
    url: 'zyapi/api/v1/record/exportRecord',
    method: 'get',
    params,
  })
}

// 销售数据
export function sellData(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/sellData',
    method: 'post',
    data,
  })
}
//销售数据导出
export function exportSellData(data) {
  return downloadFile({
    url: 'zyapi/api/v1/reconciliation/exportSellData',
    method: 'post',
    data,
  })
}
// 销售数据合计
export function feeCount(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/feeCount',
    method: 'post',
    data,
  })
}
