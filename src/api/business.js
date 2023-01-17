import request from '@/utils/request'

/**
 * 编辑在线咨询规则
 * @param {object} data
 * @param {string} data.id - 规则配置id
 * @param {string} data.bizType - 业务类型枚举(CONSULT:在线咨询)(CARRYON_PRESC:慢病续方)(REPEAT_CLINIC:在线复诊)
 * @param {string} data.bizWay - 业务形式枚举(GRAPHIC:图文)(VIDEO:视频)
 * @param {string} data.servicePeriod - 服务有效期限(格式:"正整数,单位",正整数包括0,单位:H:时/D:天/M:分)
 * @param {string} data.consultNum - 咨询条数设置
 * @param {string} data.closeClinic - 开处方操作截至诊室关闭后(格式:"正整数,单位",正整数包括0,单位:H:时/D:天/M:分)
 * @param {string} data.firstVideo - 第一次接通视频后计时,格式"数字,单位",单位:H:时/D:天/M:分
 * @param {string} data.orderTime - 预约时间到期后,格式"数字,单位",单位:H:时/D:天/M:分
 * @param {string} data.introduction - 业务介绍
 */
export function updateBizRules(data) {
  return request({
    url: '/api/v1/bizConfig/updateBizRules',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} findBizRulesInfoResponse
 * @property {string} id - 规则配置id (第一次查询时,没有配置,所以为空)
 * @property {string} bizType - 业务类型
 * @property {string} bizWay - 业务方式
 * @property {string} servicePeriod - 服务有效期限,格式"数字,单位",单位:H:时/D:天/M:分
 * @property {string} consultNum - 咨询条数
 * @property {string} firstVideo - 第一次接通视频后计时,格式"数字,单位",单位:H:时/D:天/M:分
 * @property {string} orderTime - 预约时间到期后,格式"数字,单位",单位:H:时/D:天/M:分
 * @property {string} introduction - 业务介绍
 */

/**
 * 查询在线咨询规则
 * @param {object} params
 * @param {string} params.bizType - 业务类型枚举(CONSULT:在线咨询)(CARRYON_PRESC:慢病续方)(REPEAT_CLINIC:在线复诊)
 * @param {string} params.bizWay - 业务形式枚举(GRAPHIC:图文)(VIDEO:视频)
 * @returns {Promise<findBizRulesInfoResponse>}
 */
export function findBizRulesInfo(params) {
  return request({
    url: '/api/v1/bizConfig/findBizRulesInfo',
    method: 'get',
    params,
  })
}

/**
 * 修改业务状态
 * @param {object} params
 * @param {string} params.configId - 业务配置id
 * @param {number} params.state - 业务状态(0:禁用/1:启用)
 */
export function updateOrgBizState(params) {
  return request({
    url: '/api/v1/bizConfig/updateOrgBizState',
    method: 'get',
    params,
  })
}

/**
 * 业务配置列表
 * @param {object} data
 * @param {number} [data.timeType] - 时间类型(0:创建时间)
 * @param {string} [data.startTime] - 开始时间 格式20200520121212
 * @param {string} [data.endTime] - 结束时间
 * @param {number} [data.searchType] - 关键字类型 (0:模板名称/1:模板描述)
 * @param {string} [data.searchKeyWords] - 关键字内容
 * @param {string} data.bizType - 业务类型枚举(CONSULT:在线咨询/REPEAT_CLINIC:在线复诊/CARRYON_PRESC:慢病续方)
 * @param {string} [data.bizWay] - 业务方式枚举集合(GRAPHIC:图文/VIDEO:视频/PHONE:电话)
 * @param {Double} [data.lowBeginPrice] - 业务价格低-开始
 * @param {Double} [data.lowEndPrice] - 业务价格低-结束
 * @param {Double} [data.highBeginPrice] - 业务价格高-开始
 * @param {Double} [data.highEndPrice] - 业务价格高-结束
 * @param {string} [data.titleId] - 职称名称
 * @param {number} [data.beginNum] - 医生开始数量
 * @param {number} [data.endNum] - 医生结束数量
 * @param {number} [data.state] - 状态(0:禁用/1启用)
 * @param {number} [data.currentNum] - 当前页
 * @param {number} [data.pageSize] - 每页内容数
 * @param {string} [data.field] - 排序字段
 * @param {string} [data.sorted] - 排序方向
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function orgConfigList(data) {
  return request({
    url: '/api/v1/bizConfig/orgConfigList',
    method: 'post',
    data,
  })
}

/**
 * 编辑业务
 * @param {object} data
 * @param {string} data.configId - 业务配置id
 * @param {string} data.bizType - 业务类型枚举(CONSULT:在线咨询)
 * @param {string} data.bizWays - 业务方式枚举集合(GRAPHIC:图文/VIDEO:视频/PHONE:电话)
 * @param {string} data.name - 名称
 * @param {string} data.titleIds - 职称id集合
 * @param {string} data.deptIds - 科室id集合
 * @param {string} data.deptIds - 科室id集合
 * @param {{titleID: string, ways: string, price: string}[]} data.priceDto - 价格配置集合-职称id
 * @param {number} data.state - 状态(0:禁用/1:启用)
 */
export function updateBizConfig(data) {
  return request({
    url: '/api/v1/bizConfig/updateBizConfig',
    method: 'post',
    data,
  })
}
//CDR跨系统登录
export function logov(params) {
  return request({
    url: '/api/v1/login/cdr',
    method: 'get',
    params,
  })
}
/**
 * @typedef {object} backBizConfigInfoResponse
 * @property {string} configId - 业务配置id
 * @property {string} bizType - 业务类型枚举(CONSULT:在线咨询/REPEAT_CLINIC:在线复诊/CARRYON_PRESC:慢病续方)
 * @property {string} bizWays - 业务方式枚举集合(GRAPHIC:图文/VIDEO:视频/PHONE:电话)
 * @property {string[]} titleIds - 职称id集合
 * @property {string[]} deptIds - 科室id集合
 * @property {string[]} deptIds - 科室id集合
 * @property {string} name - 名称
 * @property {string} state - 状态(0:禁用/1:启用)
 * @property {string} createDate - 创建时间
 * @property {string} createUser - 创建人
 * @property {string} ways - 业务形式(方式)
 * @property {string} title
 * @property {string} dept
 * @property {string[]} titleIds
 * @property {string[]} titleName
 * @property {string[]} deptIds
 * @property {string[]} deptName
 * @property {{ titleId: string, titleName: string, ways: string, price: number }[]} priceDto - 价格配置集合
 */

/**
 * 回显业务信息
 * @param {object} params
 * @param {string} params.configId - 业务配置id
 * @returns {Promise<backBizConfigInfoResponse>}
 */
export function backBizConfigInfo(params) {
  return request({
    url: '/api/v1/bizConfig/backBizConfigInfo',
    method: 'get',
    params,
  })
}

/**
 * 新增业务
 * @param {backBizConfigInfoResponse} data
 */
export function addBizConfig(data) {
  return request({
    url: '/api/v1/bizConfig/addBizConfig',
    method: 'post',
    data,
  })
}

/**
 * 就诊人信息（问诊）
 * @param {object} params
 * @param {string} params.orderId	- 订单ID
 */
export function patientInfo(params) {
  return request({
    url: '/api/v1/clinic/doctor/patient_info',
    method: 'get',
    params,
  })
}

/**
 * 就诊记录列表 成员档案列表
 * @param {object} params
 * @param {string} [params.userId] - 用户ID
 * @param {string} [params.orgId] - 机构ID
 * @param {string} params.memberIds - 档案成员
 * @param {string} params.type - outer：互联网/inner：院内
 * @param {string} [params.medicalType] - 就诊类型：门诊MZ/住院ZY/体检TJ
 * @param {string} [params.orgId] - 机构ID
 * @param {string} [params.currentNum] - 查询页
 * @param {string} [params.pageSize] - 每页记录数
 * @param {string} [params.field] - 排序字段
 * @param {string} [params.sorted] - 排序规则：desc/asc
 * @returns {Promise<import('./index').ListBase & { data: {}[] }>}
 */
export function archiveList(params) {
  return request({
    url: '/api/v1/archive/list',
    method: 'get',
    params,
  })
}

export function webarchiveList(params) {
  return request({
    url: '/api/v1/archive/webMedicalList',
    method: 'get',
    params,
    timeout: 60000, //偶发性超时延长
  })
}

/**
 * @typedef {object} childDtos
 * @property {string} [prefixName] - 子诊断前缀
 * @property {string} [diagnosisName] - 子诊断名
 * @property {string} [suffixName] - 子诊断后缀
 * @property {string} [sortName] - 子诊断序号名
 * @property {string} [indexCode] - 同级索引
 *
 * @typedef {object} findDiagnosisInClinicResponse
 * @property {string} [diagnosisType] - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @property {string} [prefixName] - 前缀
 * @property {string} [diagnosisName] - 诊断名
 * @property {string} [suffixName] - 后缀
 * @property {string} [sortName] - 诊断序号名
 * @property {number} [indexCode] - 同级索引
 * @property {number} [mainDiagnosis] - 主索引标识(0:不是/1:主索引)
 * @property {childDtos[]} childDtos
 *
 * 查询诊断信息
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @returns {Promise<findDiagnosisInClinicResponse>}
 */
export function findDiagnosisInClinic(params) {
  return request({
    url: '/api/v1/diagnosis/findDiagnosisInClinic',
    method: 'get',
    params,
  })
}

/**
 * 保存临时诊断
 * @param {findDiagnosisInClinicResponse} data
 */
export function saveTemporaryDiag(params, data) {
  return request({
    url: '/api/v1/diagnosis/saveTemporaryDiag',
    method: 'post',
    params,
    data,
  })
}

/**
 * @typedef {object} childDtos
 * @property {string} prefixName - 子诊断前缀
 * @property {string} diagnosisName - 子诊断名
 * @property {string} suffixName - 子诊断后缀
 * @property {string} indexCode - 同级索引
 *
 * 提交诊断
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @param {string} params.medicalId - 就诊记录id
 * @param {object} data
 * @param {string} data.diagnosisType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @param {string} data.prefixName - 前缀
 * @param {string} data.diagnosisName - 诊断名
 * @param {string} data.suffixName - 后缀
 * @param {number} data.indexCode - 同级索引
 * @param {number} data.mainDiagnosis - 主索引标识(0:不是/1:主索引)
 * @param {childDtos[]} data.childDtos
 * @returns {Promise<string>} 返回诊断id
 */
export function submitDiagnosis(params, data) {
  return request({
    url: '/api/v1/diagnosis/submitDiagnosis',
    method: 'post',
    params,
    data,
  })
}

/**
 * @typedef {object} childDtos
 * @property {string} prefixName - 子诊断前缀
 * @property {string} diagnosisName - 子诊断名
 * @property {string} suffixName - 子诊断后缀
 * @property {number} indexCode - 同级索引
 *
 * @typedef {object} dtoList
 * @property {string} id
 * @property {string} diagnosisType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @property {string} prefixName - 前缀
 * @property {string} diagnosisName - 诊断名
 * @property {string} suffixName - 后缀
 * @property {string} indexCode - 同级索引
 * @property {string} mainDiagnosis - 主索引标识(0:不是/1:是)
 * @property {childDtos[]} childDtos
 *
 * @typedef {object} historyTemp
 * @property {number} index
 * @property {string} diagTime - 诊断时间
 * @property {string} deptName - 科室
 * @property {string} diagnosisId
 * @property {dtoList[]} dtoList
 *
 * @typedef {object} commonTemp
 * @property {number} index
 * @property {string} diagType - 诊断类型(WEST_MEDICINE:西医/CH_MEDICINE_CARD:中医证型/CH_MEDICINE_NAME:中医病名)
 * @property {string} diagName - 诊断名
 * @property {string} prefixName - 前缀
 * @property {string} suffixName - 后缀
 *
 * @typedef {object} importDiagTempResponse
 * @property {historyTemp} historyTemp - 历史诊断模板
 * @property {commonTemp[]} commonTemp - 常用模板列表
 *
 * 导入诊断列表
 * @param {object} params
 * @param {string} params.memberId - 患者id
 * @param {string} [params.startTime] - 开始时间(格式 20200102121212)
 * @param {string} [params.endTime] - 结束时间
 * @param {number} [params.type] - 时间类型 0:今日/1:近3日/2:近7日
 * @param {number} [params.currentNum] - 当前页
 * @param {number} [params.pageSize] - 每页显示内容数
 * @returns {Promise<importDiagTempResponse>}
 */
export function importDiagTemp(params) {
  return request({
    url: '/api/v1/diagnosis/importDiagTemp',
    method: 'get',
    params,
  })
}

/**
 * 诊断名关键字查询
 * @param {object} params
 * @param {string} [params.searchKeywords] - 关键字
 * @param {number} params.currentNum - 分页页码
 * @param {number} params.pageSize - 分页页数
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function diagnosisKeywordSearch(params) {
  return request({
    url: '/api/v1/diagnosis/keywordSearch',
    method: 'get',
    params,
  })
}

/**
 * 5.1.9.医生申请查看就诊记录
 * @param {object} params
 * @param {string} [params.authId] - 重新申请授权ID
 * @param {string} params.medicalId - 就诊记录id
 * @param {string} params.memberId - 成员id
 * * @param {string} params.roomId - 诊室id
 * @returns {Promise}
 */
export function applyAuth(data) {
  return request({
    url: '/api/v1/archive/applyAuth',
    method: 'post',
    data,
  })
}

/**
 * 4.5.1.7就诊信息
 * @param {object} params
 * @param {string} params.medicalId - 就诊记录id
 * @returns {Promise}
 */
export function getMedicalInfo(params) {
  return request({
    url: '/api/v1/archive/getMedicalInfo',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} findDiseaseInClinicResponse
 * @property {string} mainSuit - 主诉
 * @property {string} nowDisease - 现病史
 * @property {string} phyCheck - 体格检查
 * @property {string} supCheck - 辅助检查
 * @property {string} diagnosis - 诊断
 * @property {string} dealIdea - 处理意见
 * @property {string} diseId - 病历编号
 * @property {string} medicalTime - 就诊时间
 * @property {string} medicalName - 就诊人
 * @property {string} medicalType - 诊疗类型
 *
 * 查询病历信息
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @returns {Promise<findDiseaseInClinicResponse>}
 */
export function findDiseaseInClinic(params) {
  return request({
    url: '/api/v1/etcDisease/findDiseaseInClinic',
    method: 'get',
    params,
  })
}
/**
 * @typedef {object} findDiseaseInClinicResponse
 * @property {string} mainSuit - 主诉
 * @property {string} nowDisease - 现病史
 * @property {string} phyCheck - 体格检查
 * @property {string} supCheck - 辅助检查
 * @property {string} diagnosis - 诊断
 * @property {string} dealIdea - 处理意见
 * @property {string} diseId - 病历编号
 * @property {string} medicalTime - 就诊时间
 * @property {string} medicalName - 就诊人
 * @property {string} medicalType - 诊疗类型
 *
 * 查看已发送病历信息
 * @param {object} params
 * @param {string} params.orderId - 订单id
 * @returns {Promise<findDiseaseInClinicResponse>}
 */
export function findDiseaseByOrderId(params) {
  return request({
    url: '/api/v1/etcDisease/findDiseaseByOrderId',
    method: 'get',
    params,
  })
}

/**
 * 导入病历模板列表
 * @returns {Promise<{ dtoList: {}[], mainList: {}[], nowList: {}[], phyList: {}[], supList: {}[], dealList: {}[] }>}
 */
export function importDiseaseTemp() {
  return request({
    url: '/api/v1/etcDisease/importDiseaseTemp',
    method: 'get',
  })
}

/**
 * 保存临时病历
 * @param {object} data
 * @param {string} data.orderId - 订单id
 * @param {string} [data.mainSuit] - 主诉
 * @param {string} [data.nowDisease] - 现病史
 * @param {string} [data.phyCheck] - 体格检查
 * @param {string} [data.supCheck] - 辅助检查
 * @param {string} [data.dealIdea] - 处理意见
 * @param {string} [data.diagnosis] - 诊断
 */
export function saveDiseaseTemp(data) {
  return request({
    url: '/api/v1/etcDisease/saveDiseaseTemp',
    method: 'post',
    data,
  })
}

/**
 * 提交病历
 * @param {{phyCheck: string, supCheck: string, dealIdea: string, mainSuit: string, nowDisease: string, diagnosis: string} & {orderId: String, medicalTime: string, userId: string}} data
 * @param {string} data.orderId - 订单id
 * @param {string} data.userId - 患者id
 * @param {string} data.medicalTime - 就诊时间(date类型)
 * @param {string} data.medicalId - 就诊记录id
 * @param {string} data.mainSuit - 主诉
 * @param {string} data.nowDisease - 现病史
 * @param {string} data.phyCheck - 体格检查
 * @param {string} data.supCheck - 辅助检查
 * @param {string} data.dealIdea - 处理意见
 * @param {string} data.diagnosis - 诊断
 * @returns {Promise<string>} 病历编号
 */
export function submitDisease(data) {
  return request({
    url: '/api/v1/etcDisease/submitDisease',
    method: 'post',
    data,
  })
}

/**
 * 订单列表
 * @param {object} params
 * @param {string} params.userId - 用户ID
 * @param {string} params.orgId - 机构ID
 * @param {string} params.orderType - 业务类型：CONSULT("在线咨询"), REPEAT_CLINIC("在线复诊"), CARRYON_PRESC("慢病续方")
 * @param {string} params.currentNum - 查询页
 * @param {string} params.pageSize - 每页记录数
 * @param {string} params.field - 排序字段
 * @param {string} params.sorted - 排序规则：desc/asc
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function OrderDoctorWebList(params) {
  return request({
    url: '/api/v1/order/doctor/webList',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} orderDoctorWebDetailResponse
 * @property {string} orderId - 订单号
 * @property {string} orderStatus - 订单状态:UNPAID("待付款"),PAID("已支付"),WAIT_TREAT("待接诊"),IN_TREAT("接诊中"),WAIT_TAKE("待自提"),WAIT_SEND("待发货"),WAIT_RECEIVE("待收货"),TO_EVALUATE("待评价"),IN_AFTER_SALE("售后中"),FINISHED("已完成"),CLOSED("已关闭")
 * @property {string} bizType - 业务类型:CONSULT("在线咨询"), REPEAT_CLINIC("在线复诊"), CARRYON_PRESC("慢病续方")
 * @property {string} wayType - 诊疗形式:GRAPHIC("图文"),VIDEO("视频"),PHONE("电话"),
 * @property {string} doctorName - 医生
 * @property {string} titleName - 职称
 * @property {string} deptName - 科室
 * @property {string} createTime - 下单时间
 * @property {string} memberName - 就诊人
 * @property {string} sex - 性别
 * @property {string} age - 年龄
 * @property {string} payFee - 订单金额
 *
 * 订单详情
 * @param {object} params
 * @param {string} params.orderId - 订单号
 * @returns {Promise<orderDoctorWebDetailResponse>}
 */
export function orderDoctorWebDetail(params) {
  return request({
    url: '/api/v1/order/doctor/webDetail',
    method: 'get',
    params,
  })
}

/**
 *
 * 订单详情
 */
export function patientPserList(params) {
  return request({
    url: '/api/v1/account/userList',
    method: 'get',
    params,
  })
}
/**
 * @property {string} id -
 *
 * 解绑患者账号手机号
 */

export function clearUserPhone(data) {
  return request({
    url: '/api/v1/account/clearUserPhone',
    method: 'post',
    data,
  })
}

/*
@name          ''
@desc          ''
@params
              token: //token
              timeType:    // 时间类型 1创建时间 2预约执行时间
              startTime:    //开始时间，示例20200101123030
              endTime:      //结束时间，示例20200303122222
              doctorType:   //类型 (1:草稿 2:未缴费 3:已缴费 4:已失效)
              documentId:   //单据号
              name:   //处置单名称
              patientName:   //就诊人姓名
              patientCard:   //就诊人卡号
              orderId:   //订单号
              deptName:   //执行科室名称
              status:   //处置单状态 DRAFT("草稿"),SUBMITTED("已提交"),NONEXECUTION("未执行"),EXECUTED("已执行"),CANCELLATION("已作废")
              payStatus:   //支付状态 NONPAID("未缴费"),PAID("已缴费"),RETURNPAID("已退费"),EXPIRED("已失效")
              currentNum:1    //当前页码
              pageSize:10    //每页数量
              field:create_time    //排序字段
              sorted:DESC        //排序方向
@return        ''
*/
export function disposeWebList(params) {
  return request({
    url: '/api/v1/dispose/webList',
    method: 'get',
    params,
  })
}
/*
@name         disposeChooseList        
@desc         选择处置字典 
@params       
              token: //token
              type:   //处置单类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
              sex:    //就诊人性别 男1/女0
              categoryName:    //操作类别名称
              itemName:    //诊疗项目名称
              methodName:    //检查方法名称
              currentNum:1    //当前页码
              pageSize:10    //每页数量
@return        
*/
export function disposeChooseList(params) {
  return request({
    url: '/api/v1/dictDispose/chooseList',
    method: 'get',
    params,
  })
}
/*
@name          'disposeDetail'
@desc          '获取处置单明细'
@params
              id
@return        ''
*/
export function disposeDetail(id) {
  return request({
    url: '/api/v1/dispose/detail',
    method: 'get',
    params: { id },
  })
}

/*
@name           chooseDictDispose'
@desc           选择处置字典'
@params
                token: //token
                type:   //处置单类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
                name:    //处置字典名称
                currentNum:1    //当前页码
                pageSize:10    //每页数量
@return
                [
                    {
                        "id": "10002",
                        "code": "12346",
                        "name": "检验1"
                    }
                ]
*/
export function chooseDictDispose(params) {
  return request({
    url: '/api/v1/dictDispose/chooseDictDispose',
    method: 'get',
    params: params,
  })
}

/*
@name         choosePart
@desc         选择检验标本、检查部位
@params
              token: //token
              type:   //类型 EXAMINE("部位"),LAB("标本")
              id:    //处置字典id
              currentNum:1    //当前页码
              pageSize:10    //每页数量
@return
              [
                      {
                          "relId": "4",
                          "partId": "4",
                          "partName": "标本1",
                          "next": null,
                          "ppartId": null
                      }
              ]
*/
export function choosePart(params) {
  return request({
    url: '/api/v1/dictDispose/choosePart',
    method: 'get',
    params: params,
  })
}

/*
@name         chooseMethod
@desc         选择检查方法
@params
              token: //token
              id:    //处置字典id
              currentNum:1    //当前页码
              pageSize:10    //每页数量
@return
              [
                      {
                          "relId": "1",
                          "methodId": "1",
                          "methodName": "检查方法1"
                      }
              ]
*/
export function chooseMethod(params) {
  return request({
    url: '/api/v1/dictDispose/chooseMethod',
    method: 'get',
    params: params,
  })
}
/*
@name         chooseDisDept
@desc         选择执行科室
@params
              token: //token
              id:    //处置字典id
              currentNum:1    //当前页码
              pageSize:10    //每页数量
@return
              [
                      {
                          "relId": "12",
                          "deptId": "1",
                          "deptName": "科室1"
                      }
              ]
*/
export function chooseDisDept(params) {
  return request({
    url: '/api/v1/dictDispose/chooseDisDept',
    method: 'get',
    params: params,
  })
}
/*
@name          disposeInsert
@desc          新增处置单
@params
              {
                  "sessionId":"5504167223CE49B5AB36A0B37880C052",
                  "userId":"5504167223CE49B5AB36A0B37880C052",
                  "memberId":"7DE5716B12144DD9BA41034227500F87",
                  "doctorTitle":"副主任医师",
                  "patientName":"踏古",
                  "patientCard":"1208625",
                  "type":"LAB",
                  "dictDisposeId":"10002",
                  "name":"检验1",
                  "anxious":"true",
                  "deptId":"1",
                  "deptName":"科室1",
                  "methodId":"1",
                  "methodName":"检验方法1",
                  "specimenIds":[
                      "4",
                      "5"
                  ],
                  "price":"9.99",
                  "start":"20201017100000",
                  "end":"20201017110000",
                  "remark":"这是一个备注",
                  "frequencyId":"",
                  "frequencyName":"",
                  "treatmentId":"",
                  "treatmentName":"",
                  "status":"DRAFT",
                  "partIds":[
                      "1",
                      "7"
                  ],
                  "sonPartIds":[
                      "2",
                      "3",
                      "8",
                      "9"
                  ]
              }
@return
*/
export function disposeInsert(data) {
  return request({
    url: '/api/v1/dispose/insert',
    method: 'post',
    data: data,
  })
}
/*
@name         doctorUpdateDetail
@desc         修改草稿
@params
              {
                id              String      是      处置单id
                type            String      是      处置单类型 EXAMINE("检查"),LAB("检验"),CURE("治疗")
                dictDisposeId   String      是      处置单字典表id
                name            String      是      处置单字典表名称
                anxious         Boolean     是      是否加急
                deptId          String      是      执行科室id
                deptName        String      是      执行科室名称
                methodId        String      否      检查方法id
                methodName      String      否      检查方法名称
                specimenIds     Array	      否      检验标本ids
                price           Double      是      费用
                start           String      是      预约开始执行时间
                end             String      是      预约结束执行时间
                remark          String      否      备注
                frequencyId     String      否      频次id
                frequencyName   String      否      频次名称
                treatmentId     String      否      疗程id
                treatmentName   String      否      疗程名称
                status          String      是      处置单状态 DRAFT("草稿"),SUBMITTED("已提交"),NONEXECUTION("未执行"),EXECUTED("已执行"),CANCELLATION("已作废")
                partIds         Array	      否      检查父部位ids
                sonPartIds      Array	      否      检查子部位ids
              }
@return
*/
export function doctorUpdateDetail(data) {
  return request({
    url: '/api/v1/dispose/doctorUpdateDetail',
    method: 'post',
    data: data,
  })
}
/*
@name          doctorBatchOpera
@desc          批量操作草稿
@params
               {
                    "ids":[
                        "B13686229E084762A87C9140D4ACF1E6",
                        "D9B0533552994C6EAE6E67F8E13671F5",
                        "F8CFA55CECFB456783919C2309BE08D4"
                    ],
                    "batchOperaType":"2" 操作类型 (1:删除 2:提交)
               }
@return
*/
export function doctorBatchOpera(data) {
  return request({
    url: '/api/v1/dispose/doctorBatchOpera',
    method: 'post',
    data: data,
  })
}
/*
@name         doctorUpdateStatus
@desc         修改未缴费类型状态
@params
              {
                  "id":"B13686229E084762A87C9140D4ACF1E6",
                  "status":"DRAFT" [撤回：DRAFT 作废：CANCELLATION]
              }

@return
*/
export function doctorUpdateStatus(data) {
  return request({
    url: '/api/v1/dispose/doctorUpdateStatus',
    method: 'post',
    data: data,
  })
}

/*
@name         hasDisDraft
@desc         同业务订单号的处置草稿
@params
              orderId:DZ1602311403269994
@return
*/
export function hasDisDraft(orderId) {
  return request({
    url: '/api/v1/dispose/hasDisDraft',
    method: 'get',
    params: { orderId },
  })
}

/*
@name         disposeGetPrice
@desc         获取处置价格
@params
              token:1B650467B9BE4F0C935FB7397617923A //token
              id:10006    //处置字典id
              parts:1,2,3    //部位/标本集合
              methodId:1    //检查方法
@return
*/
export function disposeGetPrice(params) {
  return request({
    url: '/api/v1/dictDispose/getPrice',
    method: 'get',
    params,
  })
}
/*
@name         disposeDate
@desc         获取预约时间、号源数
@params
              id:1,2,3    //处置字典id 多个按逗号分隔
              type:EXAMINE    //处置类型    EXAMINE：检查，LAB：检验
@return
*/
export function disposeDate(params) {
  return request({
    url: '/api/v1/dictDispose/getDisDate',
    method: 'get',
    params,
  })
}

/*
@name         findDiagByDiagId
@desc         获取预约时间、号源数
@params
              token:1B650467B9BE4F0C935FB7397617923A //token
              diagId    //诊断id
@return
*/
export function findDiagByDiagId(params) {
  return request({
    url: '/api/v1/diagnosis/findDiagByDiagId',
    method: 'get',
    params,
  })
}

/*
@name         getWebRegList
@desc         获取核酸检测预约列表
@params
              token:9C1B3EE46CE84841A902B5F7D0A048C8 //token
@return
*/
export function getWebRegList(params) {
  return request({
    url: '/api/v1/nucleateReg/webRegList',
    method: 'get',
    params,
  })
}

/*
@name         userRegDetail
@desc         核酸检测预约详情
@params
              token:9C1B3EE46CE84841A902B5F7D0A048C8 //token
@return
*/
export function userRegDetail(params) {
  return request({
    url: '/api/v1/nucleateReg/userRegDetail',
    method: 'get',
    params,
  })
}

/**
 *
 * @param {*} params
 */
export function webBasinsList(params) {
  return request({
    url: '/api/v1/nucleateReg/webBasinsList',
    method: 'get',
    params,
  })
}

/* 
  流调表记录详情
*/
export function basinsDetail(params) {
  return request({
    url: '/api/v1/nucleateReg/basinsDetail',
    method: 'get',
    params,
  })
}

/* 
  获取收费项目
*/
export function getFeeItem(params) {
  return request({
    url: '/api/v1/bizConfig/getFeeItem',
    method: 'get',
    params,
  })
}
