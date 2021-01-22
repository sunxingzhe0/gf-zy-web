import request from '@/utils/request'

/**
 * 日志管理列表
 * @param {object} params
 * @param {number} params.timeType - 时间类型：0操作时间
 * @param {string} params.startTime - 开始时间，示例20200101123030
 * @param {string} params.endTime - 结束时间，示例20200303122222
 * @param {number} params.searchType - 模糊查询类型: 0操作内容，1操作人
 * @param {string} params.searchKeywords - 模糊查询内容
 * @param {number} params.type - 日志类型：0个人，1药房，2机构
 * @param {number} params.currentNum - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<ListBase & { list: object[] }>}
 */
export function loggerManageData(params) {
  return request({
    url: '/api/v1/logger/loggerManageData',
    method: 'get',
    params,
  })
}

/**
 * 单据操作日志
 * @param {object} params
 * @param {string} params.businessRel - 单据ID
 * @param {number} params.currentNum - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<ListBase & { list: object[] }>}
 */
export function loggerBillData(params) {
  return request({
    url: '/api/v1/logger/loggerBillData',
    method: 'get',
    params,
  })
}
