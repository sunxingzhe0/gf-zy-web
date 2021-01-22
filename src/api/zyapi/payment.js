import request from '@/utils/request'
let apiV = process.env.VUE_APP_APIV ? process.env.VUE_APP_APIV : 'v1'
/**
 * .挂号记录
 * @param {object} params
 * @param {string} params.timeType - 时间条件类型 0.创建时间；1.支付时间；
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {string} params.searchType - 模糊查询类型 0.订单号； 1.患者姓名； 2.就诊卡号
 * @param {string} params.searchKeywords - 模糊查询关键字
 * @param {string} params.noType - 号源类型
 * @param {string} params.deptId - 科室ID
 * @param {string} params.startFee - 缴费起始金额
 * @param {string} params.endFee - 缴费结束范围
 * @param {string} params.payment - 支付方式
 * @param {string} params.billState - 单据状态 0：不限 1：已付款 2：已退费
 */
export function rnRecordData(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/rnRecordData',
    method: 'get',
    params,
  })
}
/**
 * 挂号记录详情
 */
export function appointmentDetail(params) {
  return request({
    url: `zyapi/api/${apiV}/order/appointmentDetail`,
    method: 'get',
    params,
  })
}
/**
 * .缴费 - 号源类型下拉列表
 */
export function noTypes(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/noTypes',
    method: 'get',
    params,
  })
}

/**
 * .门诊缴费记录
 * @param {object} params
 * @param {string} params.timeType - 时间条件类型 0.创建时间；1.支付时间；
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {string} params.searchType - 模糊查询类型 0.单据号（HIS交易流水号）；1.患者姓名； 2.就诊卡号
 * @param {string} params.searchKeywords - 模糊查询关键字
 * @param {string} params.orderItem - 项目类型
 * @param {string} params.deptId - 科室ID
 * @param {string} params.startFee - 缴费起始金额
 * @param {string} params.endFee - 缴费结束范围
 * @param {string} params.payment - 支付方式UNION("银联") WX("微信")
 * @param {string} params.billState - 单据状态 0：不限 1：已付款 2：已退费
 */
export function mzRecordData(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/mzRecordData',
    method: 'get',
    params,
  })
}
/**
 * 门诊缴费详情
 * @param {object} params
 * @param {string} params.patientId - 就诊人id；
 * @param {string} params.visitNo - 就诊流水号
 * @param {string} params.billNo - 处方号
 * @param {string} params.type - 单据状态 0：待支付 1：已完成 2：已退费
 */
export function mzRpDetail(params) {
  return request({
    url: `zyapi/api/${apiV}/order/mzRpDetail`,
    method: 'get',
    params,
  })
}
/**
 * .门诊订单类型
 */
export function orderItems(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/orderItems',
    method: 'get',
    params,
  })
}

/**
 * .住院缴费记录
 * @param {object} params
 * @param {string} params.timeType - 时间条件类型 0.创建时间；1.支付时间；
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {string} params.searchType - 模糊查询类型 0.单据号（HIS交易流水号）；1.患者姓名； 2.就诊卡号
 * @param {string} params.searchKeywords - 模糊查询关键字
 * @param {string} params.orderItem - 项目类型
 * @param {string} params.deptId - 科室ID
 * @param {string} params.startFee - 缴费起始金额
 * @param {string} params.endFee - 缴费结束范围
 * @param {string} params.payment - 支付方式UNION("银联") WX("微信")
 * @param {string} params.billState - 单据状态 0：不限 1：已付款 2：已退费
 */
export function bihRecordData(params) {
  return request({
    url: 'zyapi/api/v1/reconciliation/bihRecordData',
    method: 'get',
    params,
  })
}

/**
 * .预约体检缴费记录
 * @param {object} params
 * @param {string} params.timeType - 时间条件类型 0.创建时间 / 1:支付时间/2:预约时间
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {string} params.searchType - 模糊查询类型 0.订单号/1.体检套餐名/2.体检人/3.就诊卡号
 * @param {string} params.searchKeywords - 模糊查询关键字
 * @param {string} params.itemNum - 体检项目数
 * @param {string} params.beginNum - 数量-开始
 * @param {string} params.endNum - 数量-结束
 * @param {string} params.beginFee - 金额-开始
 * @param {string} params.endFee - 金额-结束
 * @param {string} params.payWay - 支付方式(WX-微信支付)
 * @param {string} params.orderState - 单据状态 0:已退费/1:已付款
 */
export function orderTjPayList(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/orderTjPayList',
    method: 'post',
    data,
  })
}

/**
 * .体检缴费缴费记录
 * @param {object} params
 * @param {string} params.timeType - 时间条件类型 0.创建时间 / 1:支付时间
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {string} params.searchType - 模糊查询类型 0.订单号/1.体检套餐名/2.体检人/3.就诊卡号
 * @param {string} params.searchKeywords - 模糊查询关键字
 * @param {string} params.itemNum - 体检项目数
 * @param {string} params.beginNum - 数量-开始
 * @param {string} params.endNum - 数量-结束
 * @param {string} params.beginFee - 金额-开始
 * @param {string} params.endFee - 金额-结束
 * @param {string} params.payWay - 支付方式(WX-微信支付)
 * @param {string} params.orderState - 单据状态 0:已退费/1:已付款
 */
export function tjFeeRecord(data) {
  return request({
    url: 'zyapi/api/v1/reconciliation/tjFeeRecord',
    method: 'post',
    data,
  })
}

/**
 * 体检缴费详情
 * @param {object} params
 * @param {string} params.patientId - 就诊人id；
 * @param {string} params.type - 单据状态 0:未缴费/1:已缴费/2:已退费
 */
export function getTjPayRecordInfo(params) {
  return request({
    url: `zyapi/api/v1/tj/getTjPayRecordList`,
    method: 'get',
    params,
  })
}
