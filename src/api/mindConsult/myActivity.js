import request from '@/utils/request'
import downloadFile from '@/utils/download-file'

/**
 * 活动列表
 * @param {object} params
 * @param {number} params.activityStatus 活动状态 1.进行中、2.已结束、3.暂停、4.未开始
 * @param {string} params.activityType 活动类型
 * @param {string} params.beginTime 开始时间
 * @param {string} params.creatTime 创建时间
 * @param {number} params.currentNum 当前页码
 * @param {string} params.endTime 	结束时间
 * @param {string} params.field 字段名称
 * @param {string} params.keywords 关键字查询 id/名称
 * @param {number} params.pageSize 每页显示数量
 * @param {string} params.sorted 排序方向
 *
 */
export function queryActivityList(params) {
  return request({
    url: '/api/v1/counseling/activity/queryActivity',
    method: 'get',
    params,
  })
}
/**
 * 活动详情
 * @param {object} params
 * @param {number} params.activityId 	activityId
 *
 */
export function getActivityDetail(params) {
  return request({
    url: `/api/v1/counseling/activity/getActivityDetail/${params.activityId}`,
    method: 'get',
    params,
  })
}

/**
 * 报名名单
 * @param {object} params
 * @param {number} params.activityId 	活动id
 * @param {number} params.currentNum 		当前页码
 * @param {number} params.field 	字段名称
 * @param {number} params.keywords 	关键字查询 姓名/电话
 * @param {number} params.pageSize 	每页显示数量
 * @param {number} params.signTime 	报名时间
 * @param {number} params.sorted 	排序方向
 * @param {number} params.status 	状态1.报名成功 2. 报名审核 3.报名失败
 * @param {number} params.type 	仅看退款的 传参.是 不传.否
 *
 */
export function signList(params) {
  return request({
    url: `/api/v1/counseling/sign/list`,
    method: 'get',
    params,
  })
}

/* 
  报名名单统计数据
*/
export function getCount(params) {
  return request({
    url: `/api/v1/counseling/sign/getCount`,
    method: 'get',
    params,
  })
}

/**
 * 预览
 * @param {object} params
 * @param {number} params.activityId 	activityId
 *
 */
export function previewActivity(params) {
  return request({
    url: `/api/v1/counseling/activity/previewActivity/${params.activityId}`,
    method: 'get',
    params,
  })
}

/**
 * 链接
 * @param {object} params
 * @param {number} params.activityId 	activityId
 *
 */
export function activityLink(params) {
  return request({
    url: `/api/v1/counseling/activity/activityLink/${params.activityId}`,
    method: 'get',
    params,
  })
}

/**
 * 暂停/恢复
 * @param {object} params
 * @param {number} params.activityId 	activityId
 * @param {number} params.status 	status
 *
 */
export function statusActivity(params) {
  return request({
    url: `/api/v1/counseling/activity/statusActivity`,
    method: 'post',
    params,
  })
}

/**
 * 二维码
 * @param {object} params
 * @param {number} params.activityId 	activityId
 *
 */
export function previewActivityQrCode(params) {
  return request({
    url: `/api/v1/counseling/activity/previewActivityQrCode/${params.activityId}`,
    method: 'get',
    params,
  })
}

/**
 * 新增
 * @param {object} params
 */
export function addActivity(data) {
  return request({
    url: `/api/v1/counseling/activity/addActivity`,
    method: 'post',
    data,
  })
}
/**
 * 编辑
 * @param {object} params
 */
export function editActivity(data) {
  return request({
    url: `/api/v1/counseling/activity/editActivity`,
    method: 'post',
    data,
  })
}

/* ************* */
/**
 * 活动报名记录
 * @param {object} params
 */
export function recordlist(params) {
  return request({
    url: `/api/v1/counseling/record/recordlist`,
    method: 'get',
    params,
  })
}
/**
 * 报名记录详情
 * @param {object} params
 */
export function getRecordById(params) {
  return request({
    url: `/api/v1/counseling/record/getRecordById/${params.signId}`,
    method: 'get',
    params,
  })
}

/**
 * 导出报名记录
 * @param {object} params
 */
export function recordExport(params) {
  return downloadFile({
    url: `/api/v1/counseling/record/recordExport`,
    method: 'get',
    params,
  })
}

/* 
  负责人列表
*/
export function getmanagerList(params) {
  return request({
    url: `/api/v1/counseling/activity/ManagerList`,
    method: 'get',
    params,
  })
}

/* 
 我的活动-报名详情 signId
*/
export function mySignDesc(params) {
  return request({
    url: `/api/v1/counseling/sign/mySignDesc`,
    method: 'get',
    params,
  })
}

/* 
  报名名单-名单详情 
*/
export function getSignById(params) {
  return request({
    url: `/api/v1/counseling/sign/getSignById/${params.signId}`,
    method: 'get',
    params,
  })
}

/* 
  同意报名
*/
export function signAgree(data) {
  return request({
    url: `/api/v1/counseling/sign/agree`,
    method: 'post',
    data,
  })
}

/* 
  拒绝报名
*/
export function signRefuse(data) {
  return request({
    url: `/api/v1/counseling/sign/refuse`,
    method: 'post',
    data,
  })
}

/**
 * 导出报名名单
 * @param {object} params
 */
export function signExport(params) {
  return downloadFile({
    url: `/api/v1/counseling/sign/export`,
    method: 'get',
    params,
  })
}
