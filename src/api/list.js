import request from '@/utils/request'

/**
 * 我的患者列表
 * @param {string} dateType
 * @param {string} searchType
 * @param {string} pageSize  每页数
 */
export function fetchList(params) {
  return request({
    url: '/api/v1/myPatient/list',
    method: 'get',
    params,
  })
}

/**
 * 推送消息
 * @param {Arrays}  memberIds  memberId集合
 * @param {Arrays}  memberNames  患者姓名集合
 * @param {String}  content  消息内容
 */
export function pushMsg(data) {
  return request({
    url: '/api/v1/myPatient/push',
    method: 'post',
    data,
  })
}

/**
 * 我的推送列表
 * @param {string} dateType
 * @param {string} searchType
 * @param {string} pageSize
 */
export function pushList(params) {
  return request({
    url: '/api/v1/myPatient/pushList',
    method: 'get',
    params,
  })
}

/**
 * 患者详情页
 * @param {string} id  主键id
 * @param {string} memberId  memberId
 */
export function patientInfo(params) {
  return request({
    url: '/api/v1/myPatient/detail/info',
    method: 'get',
    params,
  })
}

/**
 * 服务订单列表
 * @param {string} currentNum  当前页码
 * @param {string} pageSize  每页数量
 */
export function orderList(params) {
  return request({
    url: '/api/v1/myPatient/detail/orderList',
    method: 'get',
    params,
  })
}

/**
 * 诊室记录列表
 * @param {string} currentNum  当前页码
 * @param {string} pageSize  每页数量
 */
export function clinicRoomList(params) {
  return request({
    url: '/api/v1/myPatient/detail/clinicRoomList',
    method: 'get',
    params,
  })
}

/**
 * 诊室详情页
 * @param {string} id  主键id
 * @param {string} clinicId	  诊室id
 */
export function clinicRoomInfo(params) {
  return request({
    url: '/api/v1/myPatient/detail/clinicRoomInfo',
    method: 'get',
    params,
  })
}

/**
 * 诊室历史会话信息
 *  token:31A07975328A4D2ABE0D3F663928DF5A
    userId:F9F961C17A954F0583FCB68730E70574
    sessionId:C8849606A8EF47E8AA248F6860BA5F44    //会话ID
    startDate:        //开始日期（20200615000000）
    endDate:            //结束日期（20200615000000）
    search:        //搜索内容
    pageNum:1            //每页返回数量
    page:            //当前页码
 */
export function historyMessageList(params) {
  return request({
    url: '/api/v1/im/historyMessageList',
    method: 'get',
    params,
  })
}

/**
 * 就诊记录列表
 * @param {string} memberId  memberId
 * @param {string} currentNum	  当前页码
 * @param {string} pageSize	  每页数量
 */
export function medicalList(params) {
  return request({
    url: '/api/v1/myPatient/detail/medicalList',
    method: 'get',
    params,
  })
}

/**
 * 就诊记录详情页
 * @param {string} id  主键id
 * @param {string} medicalId	  就诊记录id
 */
export function medicalInfo(params) {
  return request({
    url: '/api/v1/myPatient/detail/medicalInfo',
    method: 'get',
    params,
  })
}

/**
 * 就诊详情处方提交记录
 * @param {string} orderId  	诊室订单id
 * @param {string} currentNum	  分页页码
 * @param {string} pageSize	  分页页数
 */
export function rpTrace(params) {
  return request({
    url: '/api/v1/prescription/rpTrace',
    method: 'get',
    params,
  })
}

/**
 * 就诊记录时间轴筛选数据
 * @param {string} memberId  成员id
 */
export function getMedicalTimeGroup(params) {
  return request({
    url: '/api/v1/archive/getMedicalTimeGroup',
    method: 'get',
    params,
  })
}

//机构端 用户管理
export function getorgUserList(params) {
  return request({
    url: '/api/v1/account/org/userList',
    method: 'get',
    params,
  })
}

/**
 * 单据操作日志
 * @param {object} params
 * @param {string} params.businessRel - 单据ID
 * @param {number} params.currentNum - 当前页码
 * @param {number} params.pageSize - 每页数量
 * @returns {Promise<ListBase & { list: object[] }>}
 */
export function loggerBillData(params) {
  return request({
    url: '/api/v1/logger/loggerBillData',
    method: 'get',
    params,
  })
}

/**
 * 基本资料列表
 * @param {object} patientId --就诊人基本信息id
 */
export function informationList(params) {
  return request({
    url: '/api/v1/myPatient/informationList',
    method: 'get',
    params,
  })
}

