import request from '@/utils/request'

const apiStoppingRecord = {
  /**
   * 停诊记录
   * @param {object} params
   * @param {boolean} params.auditResult 审批结果 true：同意/false：拒绝
   * @param {boolean} params.doctorId 医生id
   * @param {boolean} params.startTime 开始时间 格式：yyyyMMddHHmmss
   * @param {boolean} params.endTime 结束时间 格式：yyyyMMddHHmmss
   * @param {boolean} params.itemId 项目id
   * @param {boolean} params.scheduleId 排班id
   * @param {boolean} params.status 状态 1:正常/2:停诊申请中/3：同意/4:驳回/0:已关闭
   * @param {number} params.currentNum 当前页码
   * @param {string} params.field 字段名称
   * @param {string} params.keyword 关键字查询 id/名称
   * @param {number} params.pageSize 每页显示数量
   * @param {string} params.sorted 排序方向
   *
   */
  stopPageList(params) {
    return request({
      url: '/api/v1/counseling/scheduleStop/stopPageList',
      method: 'get',
      params: params,
    })
  },
}
export default apiStoppingRecord
