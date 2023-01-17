import request from '@/utils/request'
/**
 * 科室选择
 * @param {object} params
 * @param {boolean} params.tree	- 是否返回树形 tree true 按 一级科室-二级科室 拉出列表 false 则忽略有二级科室的一级科室，只返回二级科室以及没有子科室的一级科室
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function deptChooseList(params) {
  return request({
    url: 'zyapi/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

/**
 * 职称选择
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function titleChooseList() {
  return request({
    url: 'zyapi/api/v1/title/chooseList',
    method: 'get',
  })
}

/**
 * 编辑须知
 * @param id //主键ID    (没有id是则为新增,有则是编辑)
 * @param title //标题
 * @param insType //须知类型(0:挂号/1体检)
 * @param content //内容
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function editTjIns(data) {
  return request({
    url: 'zyapi/api/v1/notice/editTjIns',
    method: 'post',
    data,
  })
}

/**
 * 查看须知
 * @param id //主键ID    (没有id是则为新增,有则是编辑)
 * @param title //标题
 * @param insType //须知类型(0:挂号/1体检)
 * @param content //内容
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function getTjIns(params) {
  return request({
    url: 'zyapi/api/v1/notice/getTjIns',
    method: 'get',
    params,
  })
}

/**
 * 管理端查询列表详情
 */
export function getFeedBackList(params) {
  return request({
    url: 'zyapi/api/v1/record/getFeedBackList',
    method: 'get',
    params,
  })
}

/**
 * 回复
 */
export function feedBackReply(data) {
  return request({
    url: 'zyapi/api/v1/record/feedBackReply',
    method: 'post',
    data,
  })
}

/**
 * 获取当前行回复列表
 */
export function feedBackReplyList(params) {
  return request({
    url: `zyapi/api/v1/record/feedBackReplyList/${params.id}`,
    method: 'get',
    params,
  })
}
