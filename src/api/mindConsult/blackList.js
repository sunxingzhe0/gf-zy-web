import request from '@/utils/request'

const apiBlackList = {
  /**
   * 黑名单列表
   * @param {object} params
   *
   */
  blackList(params) {
    return request({
      url: '/api/v1/xz/patient/blackList',
      method: 'get',
      params,
    })
  },

  /**
   * 根据关键字查询患者列表
   * @param {object} params
   * @param {number} params.keywords 关键字
   *
   */
  getPatientListByKeywords(params) {
    return request({
      url: '/api/v1/xz/patient/getPatientListByKeywords',
      method: 'get',
      params,
    })
  },

  /**
   * 添加黑名单
   * @param {object} params
   * @param {number} params.currentNum 当前页码
   * @param {number} params.field 字段名称
   * @param {number} params.pageSize 每页显示数量
   * @param {number} params.patientId 患者id
   * @param {number} params.sorted 排序方向
   *
   *
   */
  addBlacklist(data) {
    return request({
      url: '/api/v1/xz/patient/addBlacklist',
      method: 'post',
      data,
    })
  },

  /**
   * 移除黑名单
   * @param {object} params
   * @param {number} params.patientId patientId
   *
   */
  removeBlacklist(data) {
    return request({
      url: `/api/v1/xz/patient/removeBlacklist/${data.patientId}`,
      method: 'post',
      data,
    })
  },

  /**
   * 批量移除黑名单
   * @param {object} params
   * @param {number} params.patientIds patientIds
   *
   */
  removeBlacklistBatch(data) {
    return request({
      url: `/api/v1/xz/patient/removeBlacklistBatch`,
      method: 'post',
      data,
    })
  },
}
export default apiBlackList
