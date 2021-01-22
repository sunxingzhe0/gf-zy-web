import request from '@/utils/request'

/**
 * @typedef {object} ListHead
 * @property {string} field - prop 当sorted为true时，字段名用于传递到后台进行排序查询使用
 * @property {string} fieldName - label 列表头名
 * @property {boolean} fixed - 是否必须显示 true固定必须显示,false放到3个点中备用显示
 * @property {boolean} sorted - 是否可以排序 true可以进行排序，false不可进行排序
 */

/**
 * @typedef {object} ListBase
 * @property {ListHead[]} headers
 * @property {number} pages
 * @property {number} total
 * @property {number} pageNum
 * @property {number} pageSize
 * @property {number} prePage
 * @property {number} nextPage
 * @property {object} extData
 */

/**
 * @typedef {object} sessionUserListResponse
 * @property {string} userId - 会话成员ID
 * @property {string} userName - 成员名称
 * @property {boolean} leader - 是否是群主
 * @property {string} headId - 头像ID
 */

/**
 * FILE_URL(fileid)
 */

/**

httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress)
        .then(onSuccess)
        .catch(onError)
    },
 */

/**
 * 文件上传
 * @param {object} data
 * @param {binary} data.file
 * @param {function} onUploadProgress
 * @returns {Promise<string>} file id
 * @param {String} uploadType NORMAL_UPLOAD("正常上传"),ANNEX("附件上传")
 */
export function uploadFile(data, onUploadProgress, params) {
  return request({
    url: '/api/v1/file/uploadFile',
    method: 'post',
    params,
    data,
    onUploadProgress,
  })
}

/**
 * 查询会话成员
 * @param {object} params
 * @param {number} params.sessionId - 会话ID
 * @param {number} params.currentNum - 当前页码
 * @param {number} params.pageNum - 每页数量
 * @returns {Promise<sessionUserListResponse[]>}
 */
export function sessionUserList(params) {
  return request({
    url: '/api/v1/im/sessionUserList',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} sessionLastMessageResponse
 * @property {string} id - 主键
 * @property {string} sessionId - 会话ID
 * @property {string} messageType - 消息类型（SESSION标识会话，NOTICE表示IM通知）
 * @property {string} childMessageType - 子消息类型，DEFAULT表示文本，IMAGE表示图片，更多类型参照IM聊天协议
 * @property {string} from - 发送者ID
 * @property {string} fromNickName - 发送者昵称或姓名
 * @property {string} to
 * @property {string} toNickName
 * @property {string} title
 * @property {string} summary
 * @property {string} body - 消息内容
 * @property {number} clientTime - 客户端时间戳
 * @property {number} serverTime - 服务器时间戳
 * @property {number} unReadNum
 * @property {number} sequence - 用户发送序列号
 * @property {number} msgId - 消息id
 * @property {string} chatType - "DOCTOR",
 * @property {boolean} isNew
 * @property {string[]} at
 * @property {string[]} instruct
 * @property {string} conferenceId
 * @property {boolean} deleteType
 */

/**
 * 获取会话中最新的一条消息
 * @param {object} params
 * @param {string} params.sessionId - 会话ID
 * @returns {Promise<sessionLastMessageResponse>}
 */
export function sessionLastMessage(params) {
  return request({
    url: '/api/v1/im/sessionLastMessage',
    method: 'get',
    params,
  })
}

/**
 * 判断用户在会话中是否说过话
 * @param {object} params
 * @param {string} params.sessionId - 会话ID
 * @param {string} params.userId - 用户ID
 * @returns {Promise<boolean>} 是否说过话
 */
export function sessionUserSpeak(params) {
  return request({
    url: '/api/v1/im/sessionUserSpeak',
    method: 'get',
    params,
  })
}

/**
 * 获取用户最新的同步指令列表版本号
 * @param {object} params
 * @param {string} params.userId - 用户ID
 * @returns {Promise<string>} 最新同步指令信息版本号
 */
export function userSyncVersion(params) {
  return request({
    url: '/api/v1/im/userSyncVersion',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} syncData
 * @property {string} command - 同步指令类型
 * @property {object} body
 * @property {number} createTime
 */

/**
 * @typedef {object} userSyncDataResponse
 * @property {syncData[]} syncData - 指令数据
 * @property {string} maxVersion - 最大版本号
 * @property {string} currMaxVersion - 最新版本号
 */

/**
 * 获取最新用户同步数据
 * @param {object} params
 * @param {string} params.userId - 用户ID
 * @param {string} params.vesion - 同步指令版本号
 * @returns {Promise<userSyncDataResponse>}
 */
export function userSyncData(params) {
  return request({
    url: '/api/v1/im/userSyncData',
    method: 'get',
    params,
  })
}

/**
 * 获取用户最新的服务器上Sequence序号
 * @param {object} params
 * @param {string} params.userId - 用户ID
 * @returns {Promise<string>} 最新Sequence号
 */
export function userImSequence(params) {
  return request({
    url: '/api/v1/im/userImSequence',
    method: 'get',
    params,
  })
}

/**
 * 历史消息接口
 * @param {object} params
 * @param {string} params.userId
 * @param {string} params.sessionId - 会话ID
 * @param {number} params.startDate - 开始日期（20200615000000）
 * @param {number} params.endDate - 结束日期（20200615000000）
 * @param {string} params.search - 搜索内容
 * @param {string} params.msgId - 从xx消息ID开始查找
 * @param {number} params.pageNum - 每页返回数量
 * @returns {Promise<sessionLastMessageResponse[]>}
 */
export function historyMessage(params) {
  return request({
    url: '/api/v1/im/historyMessage',
    method: 'get',
    params,
  })
}

/**
 * 结束服务
 */
export function finishChat(params) {
  return request({
    url: '/api/v1/clinic/doctor/over',
    method: 'get',
    params,
  })
}

/**
 * 系统消息列表
 * @param {object} params
 * @param {number} timeType - 时间类型：0推送时间
 * @param {number} startTime - 开始时间，示例20200101123030
 * @param {number} endTime - 结束时间，示例20200303122222
 * @param {number} searchType - 模糊查询类型：0消息标题
 * @param {string} searchKeywords - 模糊查询内容
 * @param {number} readType - 读取状态：0不限，1未读，2已读
 * @param {number} scope - 范围：0个人，1药房，2机构
 * @param {number} currentNum - 当前页码
 * @param {number} pageSize - 每页数量
 * @param {string} field - 排序字段
 * @param {string} sorted - 排序方向
 * @returns {Promise<ListBase & { list: object[] }>}
 */
export function queryAnyData(params) {
  return request({
    url: '/api/v1/notice/queryAnyData',
    method: 'get',
    params,
  })
}

/**
 * 删除个人系统消息
 * @param {object} params
 * @param {string} params.noticeId - 系统消息ID
 * @returns {Promise<''>}
 */
export function delNotice(params) {
  return request({
    url: '/api/v1/notice/delNotice',
    method: 'get',
    params,
  })
}

/**
 * 系统消息已读
 * @param {object} params
 * @param {string} params.noticeId - 系统消息ID
 * @returns {Promise<''>}
 */
export function readNotice(params) {
  return request({
    url: '/api/v1/notice/readNotice',
    method: 'get',
    params,
  })
}

/**
 * 系统消息一键已读
 * @returns {Promise<''>}
 */
export function batchRead(params) {
  return request({
    url: '/api/v1/notice/batchRead',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} Session
 * @property {string} memberId - 就诊人
 * @property {string} memberName - 就诊人姓名
 * @property {string} sex
 * @property {string} age
 * @property {string} bizType - 业务方式，0：图文；1：视频；
 * @property {string} bizTypeName - 业务方式描述
 * @property {string} status - 诊室状态：WAIT_TREAT 待接诊,IN_TREAT 接诊中,FINISH 结束
 * @property {string} createTime - 创建时间
 * @property {string} sessionId - 会话ID
 * @property {string} orderId - 订单ID
 *
 * @typedef {object} webDoctorSessionDataResponse
 * @property {Session[]} WAIT_TREAT - 待接诊
 * @property {Session[]} IN_TREAT - 接诊中
 * @property {Session[]} FINISH - 已结束
 */

/**
 * 医生PC诊室会话列表
 * @param {object} params
 * @param {string} params.tab - 会话标签Tab，CONSULT : 在线咨询；REPEAT_CLINIC : 在线复诊；CARRYON_PRESC : 慢病续方
 * @param {string} params.status - 诊室状态：WAIT_TREAT 待接诊,IN_TREAT 接诊中,FINISH 结束
 * @param {string} params.wayType - 业务开展方式，GRAPHIC 图文；VIDEO 视频；PHONE 电话
 * @param {string} params.startTime - 开始时间,示例：20200101122323
 * @param {string} params.endTime - 结束时间,示例：20200101122323
 * @param {string} params.search - 患者姓名模糊查找
 * @returns {Promise<webDoctorSessionDataResponse>}
 */
export function webDoctorSessionData(params) {
  return request({
    url: '/api/v1/im/webDoctorSessionData',
    method: 'get',
    params,
  })
}

/**
 * ====================================药品=================================
 */

/**
 * 药品列表（科室id+药品名）
 * @param {object} params
 * @param {string} [params.name] - 药品名
 * @param {string} [params.deptId] - 科室id
 * @param {number} [params.currentNum] - 分页页码
 * @param {number} [params.pageSize] - 分页页数
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function pageDrugByNameAndDeptId(params) {
  return request({
    url: '/api/v1/orgDrug/pageDrugByNameAndDeptId',
    method: 'get',
    params,
  })
}

/**
 * 药房范围列表
 * @param {object} params
 * @param {string} params.id - 机构药品id
 * @param {number} [params.currentNum] - 分页页码
 * @param {number} [params.pageSize] - 分页页数
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function pagePharmacyByOrgDrugId(params) {
  return request({
    url: '/api/v1/orgDrug/pagePharmacyByOrgDrugId',
    method: 'get',
    params,
  })
}

/**
 * ====================================筛选=================================
 */

/**
 * 角色选择
 * @param {object} params
 * @param {boolean} params.showUser - 是否返回患者（某些地方选择角色时不能显示患者）
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function roleChooseList(params) {
  return request({
    url: '/api/v1/role/chooseList',
    method: 'get',
    params,
  })
}

/**
 * 科室选择
 * @param {object} params
 * @param {boolean} params.tree	- 是否返回树形 tree true 按 一级科室-二级科室 拉出列表 false 则忽略有二级科室的一级科室，只返回二级科室以及没有子科室的一级科室
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function deptChooseList(params) {
  return request({
    url: '/api/v1/dept/chooseList',
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
    url: '/api/v1/title/chooseList',
    method: 'get',
  })
}

/**
 * 药房选择
 * @returns {Promise<{ id: string, name: string }[]>}
 */
export function drugStoreChooseList(params) {
  return request({
    url: '/api/v1/drugStore/chooseList',
    method: 'get',
    params,
  })
}

/**
 * 开始接诊
 */
export function beginChat(params) {
  return request({
    url: '/api/v1/clinic/doctor/receiving',
    method: 'get',
    params,
  })
}

/**
 * 5.2.3.3.服务订单审核
 * @param {String} orderId 订单ID
 * @param {Boolean} reply 回复
 */
export function orderAudit(data) {
  return request({
    url: '/api/v1/order/audit',
    method: 'post',
    data,
  })
}

/**
 * 6.1.1.1.3.WEB/APP医生端聊天界面病情描述
 * @param {String} orderId 订单ID
 */
export function orderIllness(params) {
  return request({
    url: '/api/v1/order/illness',
    method: 'get',
    params,
  })
}

/**
 *
 * @orderId { string } 订单ID
 * @sessionId { String } 会话ID
 */
export function updateChatTime(params) {
  return request({
    url: '/api/v1/im/updateChatTime',
    method: 'get',
    params,
  })
}

/**
 * 医生发起视频邀请调用接口，告诉服务器，医生向患者发起过视频
 * @orderId {string} 订单ID
 */
export function video(params) {
  return request({
    url: '/api/v1/clinic/user/video',
    method: 'get',
    params,
  })
}

// 包装单位类型
export function packingUnit(params) {
  return request({
    url: '/api/v1/drug/pageUnit',
    method: 'get',
    params,
  })
}

// 单位列表查询
export function listUnit(params) {
  return request({
    url: '/api/v1/drug/listUnit',
    method: 'get',
    params,
  })
}

/**
 * 4.4.7.诊室信息
 * @orderId {String} 订单ID
 */
export function clinicInfo(params) {
  return request({
    url: '/api/v1/clinic/info',
    method: 'get',
    params,
  })
}

/**
 * 判断医生与患者是否接通过视频
 * @orderId {String}  订单号
 * @returns {AxiosPromise}
 */
export function getVideoStatus(params) {
  return request({
    url: '/api/v1/clinic/getVideoStatus',
    method: 'get',
    params,
  })
}
