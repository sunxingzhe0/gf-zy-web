import request from '@/utils/request'
import downloadFile from '@/utils/download-file'

/**
 * 咨询室列表
 * @param {object} params
 * @param {number} params.currentNum 当前页码
 * @param {number} params.pageSize 每页显示数量
 * @param {string} type 类型：预约、团体,可用值:预约,团体
 * @param {string} params.keywords 关键字查询 id/名称
 * @param {boolean} status 状态：true-启用，false-禁用,可用值:false,true
 */
export function consulRoomList(params) {
  return request({
    url: '/api/v1/counseling/consultroom/page',
    method: 'get',
    params: params,
  })
}

/**
 * 编辑/新增
 * @param {string} id
 * @param {string} name 咨询室名称
 * @param {number} sortNum 排序
 * @param {string} type 类型：预约、团体,可用值:预约,团体
 * @param {boolean} status 状态：true-启用，false-禁用,可用值:false,true
 */

//新增
export function addRoom(data) {
  return request({
    url: '/api/v1/counseling/consultroom/add',
    method: 'post',
    data,
  })
}

//编辑
export function editRoom(data) {
  return request({
    url: '/api/v1/counseling/consultroom/edit',
    method: 'post',
    data,
  })
}

//修改排序
export function editSort(data) {
  return request({
    url: '/api/v1/counseling/consultroom/changeSortNum',
    method: 'post',
    data,
  })
}

//修改状态
export function editState(data) {
  return request({
    url: '/api/v1/counseling/consultroom/changeStatus',
    method: 'post',
    data,
  })
}

/**删除
@param {Array} ids
*/
export function delRoom(data) {
  return request({
    url: '/api/v1/counseling/consultroom/delete',
    method: 'post',
    data,
  })
}

/**
 * 导出
 * @param {object} params
 */
export function exportRoom(params) {
  return downloadFile({
    url: '/api/v1/counseling/consultroom/export',
    method: 'get',
    params,
  })
}

// 导入
export function importRoom(data) {
  return request({
    url: '/api/v1/counseling/consultroom/import',
    method: 'post',
    data,
  })
}
