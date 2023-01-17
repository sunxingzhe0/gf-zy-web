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

//对账列表
export function reconciliation(params) {
  return request({
    url: '/api/v1/reconciliation/list',
    method: 'get',
    params,
  })
}

//对账流水
export function reconciliationTotal(params) {
  return request({
    url: '/api/v1/reconciliation/total',
    method: 'get',
    params,
  })
}

///导出数据
export function exportData(params) {
  return downloadFile({
    url: '/api/v1/reconciliation/exportData',
    method: 'get',
    params,
  })
}
///导出数据
export function exportData2(params) {
  return downloadFile({
    url: '/api/v1/reconciliation/exportData2',
    method: 'get',
    params,
  })
}

// 银行流水
export function foundFlow(params) {
  return request({
    url: '/api/v1/bank/total/list',
    params,
  })
}

// 银行流水导出
export function exportFoundFlow(params) {
  return downloadFile({
    url: '/api/v1/bank/total/exportData',
    params,
  })
}

// 银行流水明细
export function foundFlowDetail(params) {
  return request({
    url: '/api/v1/bank/detail/list',
    params,
  })
}

// 银行流水明细导出
export function exportFoundFlowDetail(params) {
  return downloadFile({
    url: '/api/v1/bank/detail/exportData',
    params,
  })
}

// 对账汇总统计页
export function reconciliation3Statis(params) {
  return request({
    url: '/api/v1/reconciliation3/statistics',
    params,
  })
}

// 对账列表
export function reconciliation3List(params) {
  return request({
    url: '/api/v1/reconciliation3/list',
    params,
  })
}

// 列表统计
export function reconciliation3Total(params) {
  return request({
    url: '/api/v1/reconciliation3/total',
    params,
  })
}

// 对账列表详情
export function reconciliation3Detail(params) {
  return request({
    url: '/api/v1/reconciliation3/detail',
    params,
  })
}

// 对账汇总导出
export function reconciliation3ExportSsData(params) {
  return downloadFile({
    url: '/api/v1/reconciliation3/exportSsData',
    params,
  })
}
// 对账列表导出
export function reconciliation3ExportData(params) {
  return downloadFile({
    url: '/api/v1/reconciliation3/exportData',
    params,
  })
}

/* 支付宝流水 */
//支付宝汇总列表
export function zfbTotalList(params) {
  return request({
    url: '/api/v1/alipay/total/list',
    method: 'get',
    params,
  })
}
//支付宝汇总导出
export function zfbExportData(params) {
  return downloadFile({
    url: '/api/v1/alipay/total/exportData',
    params,
  })
}
//支付宝明细列表
export function zfbDetailList(params) {
  return request({
    url: '/api/v1/alipay/detail/list',
    method: 'get',
    params,
  })
}
//支付宝明细统计
export function zfbDetailTotal(params) {
  return request({
    url: '/api/v1/alipay/detail/total',
    method: 'get',
    params,
  })
}
//支付宝明细导出
export function zfbExportDetail(params) {
  return downloadFile({
    url: '/api/v1/alipay/detail/exportData',
    params,
  })
}

//获取冲销记录
export function writeoffTrade(params) {
  return request({
    url: '/api/v1/reconciliation3/writeoff-trade',
    method: 'get',
    params,
  })
}

//执行平账
export function executeWriteoffAccounts(data) {
  return request({
    url: '/api/v1/reconciliation3/execute-writeoff-accounts',
    method: 'post',
    data,
  })
}

//退款业务单列表
export function refundBizOrderList(params) {
  return request({
    url: '/api/v1/order/org/refundBizOrderList',
    method: 'get',
    params,
  })
}
