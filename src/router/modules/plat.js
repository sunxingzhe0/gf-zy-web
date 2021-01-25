import request from '@/utils/request'

/**
 * 我的患者列表
 * @param {string} dateType
 * @param {string} searchType
 * @param {string} pageSize  每页数
 */
export function getAdminList(params) {
  return request({
    url: '/api/v1/myPatient/list',
    method: 'get',
    params,
  })
}
