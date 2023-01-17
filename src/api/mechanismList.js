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

/**
 * 6.小程序体验版生成
 */
export function miniExperienceCreate(params) {
  return request({
    url: '/api/v1/alipayVersion/miniExperienceCreate',
    method: 'get',
    params,
  })
}
/**
 * 7.小程序体验版查询
 */
export function miniExperienceQuery(params) {
  return request({
    url: '/api/v1/alipayVersion/miniExperienceQuery',
    method: 'get',
    params,
  })
}
/**
 * 8.小程序体验版取消
 */
export function miniExperienceCancel(params) {
  return request({
    url: '/api/v1/alipayVersion/miniExperienceCancel',
    method: 'get',
    params,
  })
}
/**
 * 9.提交审核
 */
export function miniAuditApply(data) {
  return request({
    url: '/api/v1/alipayVersion/miniAuditApply',
    method: 'post',
    data,
  })
}
/**
 * 10.撤销审核
 */
export function miniAuditCancel(params) {
  return request({
    url: '/api/v1/alipayVersion/miniAuditCancel',
    method: 'get',
    params,
  })
}
/**
 * 11.小程序上架
 */
export function miniOnline(params) {
  return request({
    url: '/api/v1/alipayVersion//miniOnline',
    method: 'get',
    params,
  })
}
/**
 * 12.小程序下架
 */
export function miniOffline(params) {
  return request({
    url: '/api/v1/alipayVersion/miniOffline',
    method: 'get',
    params,
  })
}
/**
 * 13.小程序退回开发
 */
export function miniAuditedCancel(params) {
  return request({
    url: '/api/v1/alipayVersion/miniAuditedCancel',
    method: 'get',
    params,
  })
}
/**
 * 14.小程序回滚版本
 */
export function miniRollback(params) {
  return request({
    url: '/api/v1/alipayVersion/miniRollback',
    method: 'get',
    params,
  })
}
/**
 * 15.小程序删除版本
 */
export function miniDelete(params) {
  return request({
    url: '/api/v1/alipayVersion/miniDelete',
    method: 'get',
    params,
  })
}
/**
 * 16.小程序版本详情查询
 */
export function miniDetailQuery(params) {
  return request({
    url: '/api/v1/alipayVersion/miniDetailQuery',
    method: 'get',
    params,
  })
}
/**
 * 16.小程序版本列表查询
 */
export function miniVersionList(params) {
  return request({
    url: '/api/v1/alipayVersion/miniVersionList',
    method: 'get',
    params,
  })
}
