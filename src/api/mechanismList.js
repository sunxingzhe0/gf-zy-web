import request from '@/utils/request'

/**
 * 1.新增机构及管理员账号
 * @param {Array} orgName
 * @param {string} platOrgId
 * @param {Integer} account
 * @param {string} password
 */
export function initOrg(data) {
  return request({
    url: '/api/v1/platform/initOrg',
    method: 'post',
    data,
  })
}
/**
 * 1.机构列表
 * @param {string} startTime //开始时间，示例20200101123030
 * @param {string} endTime //结束时间，示例20200303122222
 * @param {Number} searchType //模糊查询类型：0机构名称、1编号、2账号、3联系人、4联系电话、5机构地址
 * @param {string} searchKeywords //模糊查询内容
 * @param {Boolean} state //是否启用 不传即不限 true/启用 false/禁用
 * @param {Number} currentNum //当前页码
 * @param {Number} pageSize //每页数量
 */
export function mechanismList(params) {
  return request({
    url: '/api/v1/platform/list',
    method: 'get',
    params,
  })
}
