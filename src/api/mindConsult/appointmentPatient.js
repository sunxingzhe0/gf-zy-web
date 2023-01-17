import request from '@/utils/request'

const apiXzPatient = {
  /**
   * 预约患者列表
   * @param {object} params
   * @param {boolean} params.enabled 状态true启用false禁用
   * @param {number} params.currentNum 当前页码
   * @param {string} params.field 字段名称
   * @param {string} params.keywords 关键字查询 id/名称
   * @param {number} params.pageSize 每页显示数量
   * @param {string} params.sorted 排序方向
   *
   */
  reservedList(params) {
    return request({
      url: '/api/v1/xz/patient/reservedList',
      method: 'get',
      params: params,
    })
  },
  /**
   * 患者管理
   * @param {object} params
   * @param {number} params.currentNum 当前页码
   * @param {string} params.field 字段名称
   * @param {string} params.keywords 关键字查询 id/名称
   * @param {number} params.pageSize 每页显示数量
   * @param {string} params.sorted 排序方向
   *
   */
  patientList(params) {
    return request({
      url: '/api/v1/xz/patient/list',
      method: 'get',
      params: params,
    })
  },
  /**
   * 患者详情
   * @param {object} id
   *
   */
  patientInfo(id) {
    return request({
      url: `/api/v1/xz/patient/get/${id}`,
      method: 'get',
    })
  },
  /**
   * 我的预约-接诊
   * @param {object} id
   *
   */
  acceptVisit(id) {
    return request({
      url: `/api/v1/xz/patient/acceptVisit/${id}`,
      method: 'post',
    })
  },
  /**
   * 我的预约-结束
   * @param {object} params
   * @param {number} params.cost 诊疗费用
   * @param {string} params.deptName 科室名称
   * @param {string} params.doctor 医生
   * @param {string} params.doctorId 医生id
   * @param {number} params.entryId 预约项目编码
   * @param {string} params.entryName 预约项目名称
   * @param {string} params.memberId
   * @param {string} params.orgId 机构ID
   * @param {string} params.periodName 时段名称
   * @param {string} params.reservationDate 预约日期
   * @param {string} params.reservationDtime 预约时段
   * @param {string} params.scheduleId 排班ID
   *
   */
  endVisit(data) {
    return request({
      url: `/api/v1/xz/patient/endVisit/${data.id}`,
      method: 'post',
      data,
    })
  },
  /**
   * 录入信息
   * @param {object} params
   * @param {number} params.content 内容
   * @param {string} params.createTime 创建时间
   * @param {string} params.createUser 姓名
   * @param {string} params.dept 科室
   * @param {number} params.picIds 图片id,逗号隔开
   * @param {string} params.reserveId 预约单id
   *
   */
  inputContent(data) {
    return request({
      url: `/api/v1/counseling/reservation/inputContent`,
      method: 'post',
      data,
    })
  },
  /**
   * 获取接诊记录信息
   * @param {object} id
   *
   */
  getReserveInfo(params) {
    return request({
      url: `/api/v1/counseling/reservation/getReserveInfo`,
      method: 'get',
      params,
    })
  },
  /**
   * 删除录入信息
   * @param {object} id
   *
   */
  delInput(id) {
    return request({
      url: `/api/v1/counseling/reservation/delInput/${id}`,
      method: 'post',
    })
  },
  /**
   * 编辑录入信息
   * @param {object} params
   * @param {string} params.content 内容
   * @param {string} params.id
   * @param {string} params.createTime 创建时间
   * @param {string} params.createUser 姓名
   * @param {string} params.dept 科室
   * @param {string} params.picIds 图片id,逗号隔开
   * @param {string} params.reserveId 预约单id
   *
   */
  editInput(data) {
    return request({
      url: `/api/v1/counseling/reservation/editInput`,
      method: 'post',
      data,
    })
  },
  /**
   * 新增分组
   * @param {object} params
   * @param {string} params.name 名称
   *
   */
  addGroup(data) {
    return request({
      url: `/api/v1/xz/patient/addGroup`,
      method: 'post',
      data,
    })
  },
  /**
   * 编辑分组
   * @param {object} params
   * @param {string} params.name 名称
   * @param {string} params.id
   *
   */
  editGroup(data) {
    return request({
      url: `/api/v1/xz/patient/editGroup`,
      method: 'post',
      data,
    })
  },
  /**
   * 批量删除分组
   * @param {object} params
   * @param {string} params.ids
   *
   */
  delGroup(data) {
    return request({
      url: `/api/v1/xz/patient/delGroup`,
      method: 'post',
      data,
    })
  },
  /**
   * 批量移动分组
   * @param {object} params
   * @param {string} params.id
   * @param {string} params.patientIds 批量移动患者id集合
   *
   */
  moveGroup(data) {
    return request({
      url: `/api/v1/xz/patient/moveGroup`,
      method: 'post',
      data,
    })
  },
  /**
   * 我的分组列表
   * @param {object} params
   * @param {string} params.doctorId 医生id
   *
   */
  myGroupList(params) {
    return request({
      url: `/api/v1/xz/patient/myGroupList`,
      method: 'get',
      params,
    })
  },
  /**
   * 根据关键字获取就诊人信息
   * @param {string} keyWord
   *
   */
  getPatientByKeyword(params) {
    return request({
      url: `/api/v1/counseling/reservation/getPatientByKeyword`,
      method: 'get',
      params,
    })
  },
  /**
   * 医生选择列表
   * @param {string}
   *
   */
  getSelectDocList(params) {
    return request({
      url: `/api/v1/counseling/reservation/getSelectDocList`,
      method: 'get',
      params,
    })
  },
  /**
   * 补录信息
   * @param {object} params
   * @param {string} params.acceptTime
   * @param {string} params.addressNow
   * @param {string} params.docId
   * @param {string} params.docName
   * @param {string} params.endTime
   * @param {string} params.idCard
   * @param {string} params.itemId
   * @param {string} params.itemName
   * @param {string} params.memberId
   * @param {string} params.name
   * @param {string} params.nums
   * @param {string} params.phone
   * @param {string} params.roomId
   * @param {string} params.type
   * @param {string} params.visitDate
   * @param {Array} params.inputList
   * @param {string} params.inputList.content
   * @param {string} params.inputList.createTime
   * @param {string} params.inputList.createUser
   * @param {string} params.inputList.dept
   * @param {string} params.inputList.id
   * @param {string} params.inputList.picIds
   * @param {string} params.inputList.reserveId
   *
   */
  collectionInfo(data) {
    return request({
      url: `/api/v1/counseling/reservation/collectionInfo`,
      method: 'post',
      data,
    })
  },
  /**
   * 根据预约单查询风险报告列表
   * @param {string} reservationId 预约单id
   *
   */
  listByReservationId(params) {
    return request({
      url: `/api/v1/counseling/riskReport/listByReservationId`,
      method: 'get',
      params,
    })
  },
  /**
   * 新增|暂存风险报告
   * @param {Object} params
   * @param {boolean} params.draft //是否草稿 true：是/false:否
   * @param {string} params.id //id 编辑时不能为null
   * @param {string} params.images //图片id 英文逗号分隔
   * @param {string} params.reservationId //	预约单id
   * @param {string} params.text //	文本输入框
   */
  riskReportAdd(data) {
    return request({
      url: `/api/v1/counseling/riskReport/add`,
      method: 'post',
      data,
    })
  },
  /**
   * 编辑风险报告
   * @param {Object} params
   * @param {boolean} params.draft //是否草稿 true：是/false:否
   * @param {string} params.id //id 编辑时不能为null
   * @param {string} params.images //图片id 英文逗号分隔
   * @param {string} params.reservationId //	预约单id
   * @param {string} params.text //	文本输入框
   */
  riskReportEdit(data) {
    return request({
      url: `/api/v1/counseling/riskReport/edit`,
      method: 'post',
      data,
    })
  },
  /**
   * 删除风险报告
   * @param {Object} params
   * @param {boolean} params.id //id
   */
  riskReportDel(data) {
    return request({
      url: `/api/v1/counseling/riskReport/del/${data.id}`,
      method: 'post',
      data,
    })
  },
  /**
   * 预约患者-爽约
   * @param {Object} params
   * @param {boolean} params.id //id
   */
  brokePromise(data) {
    return request({
      url: `/api/v1/xz/patient/brokePromise/${data.id}`,
      method: 'post',
      data,
    })
  },
  /**
   * 预约患者-取消接诊
   * @param {Object} params
   * @param {boolean} params.id //id
   */
  cancelAccept(id) {
    return request({
      url: `/api/v1/xz/patient/cancelAccept/${id}`,
      method: 'post',
    })
  },
}
export default apiXzPatient
