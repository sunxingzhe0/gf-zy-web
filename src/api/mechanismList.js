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

/**
 * 3.更改机构状态
 * @param {string} id //	机构id
 * @param {boolean} id //	机构状态 启用 /禁用 默认启用
 */
export function changeState(data) {
  return request({
    url: '/api/v1/platform/changeState',
    method: 'post',
    data,
  })
}
/**
  4.获取机构详情
*/
export function getInfo(params) {
  return request({
    url: '/api/v1/platform/get',
    method: 'get',
    params,
  })
}
/**
 * 5.修改机构信息
 */
export function editInfo(data) {
  return request({
    url: '/api/v1/platform/edit',
    method: 'post',
    data,
  })
}
