import request from '@/utils/request'
import downloadFile from '@/utils/download-file'

const apiLeaveApproval = {
  /**
   * 请假记录列表
   * @param {object} params
   * @param {boolean} params.activityStatus 1.进行中、2.已结束、3.暂停、4.未开始
   * @param {number} params.currentNum 当前页码
   * @param {string} params.field 字段名称
   * @param {string} params.keywords 关键字查询 id/名称
   * @param {number} params.pageSize 每页显示数量
   * @param {string} params.sorted 排序方向
   *
   */
  leaveList(params) {
    return request({
      url: '/api/v1/counseling/leave/leaveList',
      method: 'get',
      params: params,
    })
  },

  /**
   * id查询
   * @param {object} params
   *
   */
  leaveById(params) {
    return request({
      url: `/api/v1/counseling/leave/leaveById/${params.reservationId}`,
      method: 'get',
      params: params,
    })
  },

  /**
   * id查询
   * @param {object} params
   *
   */
  agreeOrRefuse(params) {
    return request({
      url: `/api/v1/counseling/leave/agreeOrRefuse`,
      method: 'post',
      data: params,
    })
  },
  /**
   * 导出
   * @param {object} params
   */
  recordExport(params) {
    return downloadFile({
      url: `/api/v1/counseling/leave/recordExport`,
      method: 'get',
      params,
    })
  },
}
export default apiLeaveApproval
