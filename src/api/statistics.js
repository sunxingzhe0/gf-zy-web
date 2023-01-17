import request from '@/utils/request' //医生端、药房端、机构端
import downloadFile from '@/utils/download-file'
/*订单的统计数据请求*/ export function getStatistics(params) {
  return request({
    url: `/api/v1/order/count`,
    method: 'get',
    params,
  })
}
//订单统计图、医生端、药房端、机构端
export function statChart(params) {
  return request({
    url: '/api/v1/order/countChart',
    method: 'get',
    params,
  })
}

//科室医生订单数（金额）统计表、医生端、药房端、机构端
export function orderCountTable(params) {
  return request({
    url: '/api/v1/order/countTable',
    method: 'get',
    params,
  })
}
//医生端、评价统计显示
export function edicalSystem(params) {
  return request({
    url: '/api/v1/evaluate/statistics',
    method: 'get',
    params,
  })
}
//医生端 、 评价统计方式
export function tongFang(params) {
  return request({
    url: '/api/v1/evaluate/statisticsRant',
    method: 'get',
    params,
  })
}
//医生端 、 导出评价
export function eadPrice(params) {
  return request({
    url: '/api/v1/evaluate/evaluateExport',
    method: 'get',
    params,
  })
}
//评论统计显示 、药房端
export function orgStat(params) {
  return request({
    url: '/api/v1/evaluate/orgStatistics',
    method: 'get',
    params,
  })
}

//机构端统计排名

//药品销售统计 、药房端
export function sale(params) {
  return request({
    url: '/api/v1/drug/count/sales',
    method: 'get',
    params,
  })
}

//药品排名 、药房端
export function panKins(params) {
  return request({
    url: '/api/v1/drug/count/ranking',
    method: 'get',
    params,
  })
}

//机构端、统计排名
export function rankingCode(params) {
  return request({
    url: '/api/v1/evaluate/orgStatisticsRanking',
    method: 'get',
    params,
  })
}

//全局 科室列表

export function overall(params) {
  return request({
    url: '/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

//导出数据
export function exportDatabs(params) {
  return downloadFile({
    url: '/api/v1/evaluate/evaluateExport',
    method: 'get',
    params,
  })
}

//业务统计列表
export function bizCountJGPT(params) {
  return request({
    url: '/api/v1/bizConfig/bizCountJGPT',
    method: 'get',
    params,
  })
}

//导出业务统计列表
export function exportBizCountJGPT(params) {
  return downloadFile({
    url: '/api/v1/bizConfig/exportBizCountJGPT',
    method: 'get',
    params,
  })
}

//----------------------------------------心资预约-----------------------------------------
/**
 * 心咨预约医生业务数据统计
 * @param {object} params
 * @param {string} params.dateHigh 开始时间
 * @param {string} params.dateLow 结束时间
 * @param {number} params.currentNum 当前页码
 * @param {string} params.field 字段名称
 * @param {number} params.pageSize 每页显示数量
 * @param {string} params.sorted 排序方向
 *
 */
export function mindDoctorStats(params) {
  return request({
    url: '/api/v1/counseling/stats/doctorStats',
    method: 'get',
    params,
  })
}

// 医生业务导出
export function exportDoctorStats(params) {
  return downloadFile({
    url: '/api/v1/counseling/stats/doctorExport',
    method: 'get',
    params,
  })
}

/**
 * 患者挂号数据统计
 * @param {object} params
 * @param {string} params.dateHigh 开始时间
 * @param {string} params.dateLow 结束时间
 * @param {number} params.currentNum 当前页码
 * @param {string} params.field 字段名称
 * @param {string} params.keywords 关键字查询 姓名/电话/就诊卡号/备注/预约单号
 * @param {number} params.pageSize 每页显示数量
 * @param {string} params.sorted 排序方向
 *
 */
export function mindPatientStats(params) {
  return request({
    url: '/api/v1/counseling/stats/personStats',
    method: 'get',
    params,
  })
}

// 患者挂号导出
export function exportPatientStats(params) {
  return downloadFile({
    url: '/api/v1/counseling/stats/personExport',
    method: 'get',
    params,
  })
}


/**
 * 获取购买次数统计数据
 * @param {object} params
 * @param {string} params.beginTime 开始时间
 * @param {string} params.endTime 结束时间

 *
 */
 export function bizClinicCount(params) {
  return request({
    url: '/api/v1/bizConfig/bizClinicCount',
    method: 'get',
    params,
  })
}