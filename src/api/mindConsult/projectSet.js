import request from '@/utils/request'

const apiProjectSet = {
  /**
   * 心咨项目列表
   * @param {object} params
   * @param {boolean} params.enabled 状态true启用false禁用
   * @param {number} params.currentNum 当前页码
   * @param {string} params.field 字段名称
   * @param {string} params.keywords 关键字查询 id/名称
   * @param {number} params.pageSize 每页显示数量
   * @param {string} params.sorted 排序方向
   *
   */
  itemList(params) {
    return request({
      url: '/api/v1/counseling/item/list',
      method: 'get',
      params: params,
    })
  },
  /**
   * 心咨项目新增
   * @param {object} params
   * @param {string} params.name 项目名称
   * @param {number} params.duration 时长
   * @param {string} params.price 价格
   * @param {number} params.sort 排序
   * @param {boolean} params.enabled 状态true启用false禁用
   *
   */
  itemAdd(data) {
    return request({
      url: '/api/v1/counseling/item/add',
      method: 'post',
      data,
    })
  },
  /**
   * 心咨项目编辑
   * @param {object} params
   * @param {string} params.name 项目名称
   * @param {string} params.id
   * @param {number} params.duration 时长
   * @param {string} params.price 价格
   * @param {number} params.sort 排序
   * @param {boolean} params.enabled 状态true启用false禁用
   *
   */
  itemEdit(data) {
    return request({
      url: '/api/v1/counseling/item/edit',
      method: 'post',
      data,
    })
  },
  /*变更项目状态*/
  itemChangeEnabled(id) {
    return request({
      url: `/api/v1/counseling/item/changeEnabled/${id}`,
      method: 'post',
    })
  },
  /**
   * 批量变更项目状态
   * @param {object} params
   * @param {string} params.batchIds
   * @param {boolean} params.enabled 状态true启用false禁用
   *
   */
  batchChangeEnabled(data) {
    return request({
      url: `/api/v1/counseling/item/batchChangeEnabled`,
      method: 'post',
      data,
    })
  },
  //删除项目
  itemDel(id) {
    return request({
      url: `/api/v1/counseling/item/del/${id}`,
      method: 'post',
    })
  },
  /**
   * 批量删除项目
   * @param {object} params
   * @param {string} params.batchIds
   *
   */
  batchDel(data) {
    return request({
      url: `/api/v1/counseling/item/batchDel`,
      method: 'post',
      data,
    })
  },
  /**
   * his诊疗项目
   *
   */
  chooseHisDiagDict(params) {
    return request({
      url: '/api/v1/counseling/item/chooseHisDiagDict',
      method: 'get',
      params: params,
    })
  },
  /**
   * 科室列表
   *
   */
  departments(params) {
    return request({
      url: '/api/v1/counseling/appointment/departments',
      method: 'get',
      params: params,
    })
  },
}
export default apiProjectSet
