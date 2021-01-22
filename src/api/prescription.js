import request from '@/utils/request'

/**
 * 新增
 * @param {object} data
 * @param {String} data.memberId - 就诊人id
 * @param {String} data.memberName - 就诊人姓名
 * @param {Integer} data.memberSex - 就诊人性别(0女1男)
 * @param {Date} data.treatmentTime - 就诊时间
 * @param {String} data.serviceType - 业务类型(CONSULT("在线咨询"),REPEAT_CLINIC("在线复诊"),CARRYON_PRESC("慢病续方"),)
 * @param {String} data.serviceMode - 业务形式(GRAPHIC("图文"),VIDEO("视频"),PHONE("电话"),)
 * @param {String} data.titleId - 开方医生职称id
 * @param {String} data.orderId - 诊室订单号
 * @returns {Promise<string>} 处方ID
 */
export function saveRp(data) {
  return request({
    url: '/api/v1/prescription/saveRp',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} rpDrug
 * @property {String} type - WESTERN_MEDICINE("西药"), CHINESE_PATENT_MEDICINE("中成药"), HERBS("草药")
 * @property {String} name - 药品名称
 * @property {String} spec - 规格
 * @property {String} useWays - 用药途径
 * @property {String} singleDose - 单次剂量
 * @property {String} useFrequency - 用药频次
 * @property {String} total - 总量
 * @property {String} medicare - A("甲"),B("乙"),C("丙"),ME_FEE("自费")
 * @property {String} price - 单价
 * @property {String} totalPrice - 总价
 * @property {String} receivePharmacyId - 接收药房id
 * @property {String} remark - 备注
 * @property {Number} seq - 序号
 * @property {String} groupId - 分组标识
 * @property {String} orgDrugId - 机构药品id
 *
 * 编辑
 * @param {object} data
 * @param {string} data.id
 * @param {rpDrug[]} data.rpDrugList
 */
export function editRp(data) {
  return request({
    url: '/api/v1/prescription/editRp',
    method: 'post',
    data,
  })
}

/**
 * 删除
 * @param {object} data
 * @param {string} data.id
 */
export function delRp(data) {
  return request({
    url: '/api/v1/prescription/delRp',
    method: 'post',
    data,
  })
}

/**
 * 撤回
 * @param {object} data
 * @param {string} data.id
 */
export function withdrawRp(data) {
  return request({
    url: '/api/v1/prescription/withdrawRp',
    method: 'post',
    data,
  })
}

/**
 * 提交
 * @param {object} data
 * @param {{ id: string, rpDrugList: rpDrug[] }} data.submit - 提交的处方
 * @param {{ id: string, rpDrugList: rpDrug[] }} data.unSubmitted - 未提交的处方
 * @param {string[]} data.rpIds - 处方下无药品的处方id
 */
export function submitRp(data) {
  return request({
    url: '/api/v1/prescription/submitRp',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} rpListResponse
 * @property {String} id - 主键id
 * @property {String} prescriptionNo - 处方号
 * @property {string} createTime - 存稿时间
 * @property {string} updateTime - 更稿时间
 * @property {string} submitTime - 提交时间
 * @property {string} auditTime - 审核时间
 * @property {string} diagnosisTime - 诊断时间
 * @property {String} westPrice - 西药金额
 * @property {String} chPatentPrice - 中成药金额
 * @property {String} prescriptionPrice - 处方金额
 * @property {rpDrug[]} rpDrugList - 处方药品内容
 * @property {String} status - 处方状态 DRAFT("草稿"),PENDING_REVIEW("待审核"),REJECTED("已驳回"),PASSED("已通过"),
 * @property {String} deptId - 科室id
 * @property {String} deptName - 科室名称
 *
 * 处方列表
 * @param {object} params
 * @param {string} params.orderId - 诊室订单id
 * @returns {Promise<rpListResponse>}
 */
export function rpList(params) {
  return request({
    url: '/api/v1/prescription/rpList',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} oftenDrugResponse
 * @property {string} orgDrugId - 机构药品id
 * @property {string} orgDrugName - 机构药品名
 * @property {string} spec - 规格
 * @property {string} uditTime - 最近一次审核审核通过的时间
 *
 * 常用药品列表
 * @returns {Promise<oftenDrugResponse>}
 */
export function oftenDrug() {
  return request({
    url: '/api/v1/prescription/oftenDrug',
    method: 'get',
  })
}

/**
 * @typedef {object} historyRpResponse
 * @property {String} id - 主键id
 * @property {String} prescriptionNo - 处方号
 * @property {string} createTime - 存稿时间
 * @property {string} updateTime - 更稿时间
 * @property {string} submitTime - 提交时间
 * @property {string} auditTime - 审核时间
 * @property {string} diagnosisTime - 诊断时间
 * @property {String} westPrice - 西药金额
 * @property {String} chPatentPrice - 中成药金额
 * @property {String} prescriptionPrice - 处方金额
 * @property {rpDrug[]} rpDrugList - 处方药品内容
 * @property {String} status - 处方状态 DRAFT("草稿"),PENDING_REVIEW("待审核"),REJECTED("已驳回"),PASSED("已通过"),
 * @property {String} deptId - 科室id
 * @property {String} deptName - 科室名称
 *
 * 历史处方
 * @param {object} params
 * @param {String} params.startTime - 开始时间
 * @param {String} params.endTime - 结束时间
 * @returns {Promise<historyRpResponse>}
 */
export function historyRp(params) {
  return request({
    url: '/api/v1/prescription/historyRp',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} rpTraceResponse
 * @property {String} rpId - 处方号
 * @property {String} doctorName - 操作人
 * @property {String} submitTime - 操作时间
 *
 * 处方痕迹
 * @param {object} params
 * @param {String} params.orderId - 诊室订单id
 * @param {String} [params.currentNum] - 分页页码
 * @param {String} [params.pageSize] - 分页页数
 * @returns {Promise<rpTraceResponse>}
 */
export function rpTrace(params) {
  return request({
    url: '/api/v1/prescription/rpTrace',
    method: 'get',
    params,
  })
}

/**
 * 分页查询
 * @param {object} params
 * @param {Number} [params.searchType] - 关键字搜索类型（0.处方号,1.患者姓名,2.开方医师,3.诊断结果）
 * @param {String} [params.searchKeywords] - 关键字内容
 * @param {Number} [params.timeType] - 时间类型（0.创建时间,1.提交时间,2审核时间）
 * @param {String} [params.startTime] - 开始时间
 * @param {String} [params.endTime] - 结束时间
 * @param {String} [params.business] - 业务类型CONSULT("在线咨询"),REPEAT_CLINIC("在线复诊"),CARRYON_PRESC("慢病续方")
 * @param {String} [params.consult] - 业务形式 GRAPHIC("图文"),VIDEO("视频"),PHONE("电话")
 * @param {Number} [params.sex] - 性别(0女、1男)
 * @param {Number} [params.ageMin] - 年龄Min
 * @param {Number} [params.ageMax] - 年龄Max
 * @param {String} [params.titleId] - 医生职称Id
 * @param {String} [params.deptId] - 科室Id
 * @param {Number} [params.numberMin] - 药品数量Min
 * @param {Number} [params.numberMax] - 药品数量Max
 * @param {String} [params.priceMin] - 金额Min
 * @param {String} [params.priceMax] - 金额Max
 * @param {String} [params.rpStatus] - 处方状态 DRAFT("草稿"),PENDING_REVIEW("待审核"),REJECTED("已驳回"),PASSED("已通过")
 * @param {Number} [params.currentNum] - 分页页码（默认1）
 * @param {Number} [params.pageSize] - 分页页数（默认10）
 * @param {String} [params.field] - 排序字段
 * @param {String} [params.sorted] - 排序规则（asc，desc）
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function webPageRpList(params) {
  return request({
    url: '/api/v1/prescription/webPageRpList',
    method: 'get',
    params,
  })
}

/**
 * 操作
 * @param {object} data
 * @param {String} data.id - 主键id
 * @param {String} data.statusType - 处方状态 DRAFT("草稿"),PENDING_REVIEW("待审核"),REJECTED("已驳回"),PASSED("已通过"),
 * @param {String} data.reason - 处方驳回原因
 */
export function operateRp(data) {
  return request({
    url: '/api/v1/prescription/operateRp',
    method: 'post',
    data,
  })
}

/**
 * 驳回模板
 * @param {object} params
 * @param {number} params.searchType - 关键字搜索类型（0.内容）
 * @param {string} params.searchKeywords - 关键字内容
 * @param {number} params.timeType - 时间类型（0.创建时间）
 * @param {string} params.startTime - 开始时间
 * @param {string} params.endTime - 结束时间
 * @param {number} params.numberMin - 使用次数Min
 * @param {number} params.numberMax - 使用次数Max
 * @param {number} params.currentNum - 分页页码（默认1）
 * @param {number} params.pageSize - 分页页数（默认10）
 * @param {string} params.field - 排序字段
 * @param {string} params.sorted - 排序规则（asc，desc）
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function pageRefuse(params) {
  return request({
    url: '/api/v1/prescription/pageRefuse',
    method: 'get',
    params,
  })
}

/**
 * 新增驳回模板
 * @param {object} data
 * @param {string} data.content - 内容
 * @returns {Promise<string>} 模板ID
 */
export function saveRefuse(data) {
  return request({
    url: '/api/v1/prescription/saveRefuse',
    method: 'post',
    data,
  })
}

/**
 * 分页查询
 * @param {object} params
 * @param {number} params.searchType - 关键字搜索类型（0.处方号,1.患者姓名,2.关联服务订单,3.诊断结果）
 * @param {String} params.searchKeywords - 关键字内容
 * @param {number} params.timeType - 时间类型（0.创建时间,1.开方时间）
 * @param {String} params.startTime - 开始时间
 * @param {String} params.endTime - 结束时间
 * @param {String} params.business - 业务类型CONSULT("在线咨询"),REPEAT_CLINIC("在线复诊"),CARRYON_PRESC("慢病续方")
 * @param {String} params.consult - 业务形式 GRAPHIC("图文"),VIDEO("视频"),PHONE("电话")
 * @param {number} params.sex - 性别(0女、1男)
 * @param {number} params.ageMin - 年龄Min
 * @param {number} params.ageMax - 年龄Max
 * @param {number} params.numberMin - 药品数量Min
 * @param {number} params.numberMax - 药品数量Max
 * @param {String} params.priceMin - 金额Min
 * @param {String} params.priceMax - 金额Max
 * @param {String} params.rpStatus - 处方状态 DRAFT("草稿"),PENDING_REVIEW("待审核"),REJECTED("已驳回"),PASSED("已通过")
 * @param {number} params.currentNum - 分页页码（默认1）
 * @param {number} params.pageSize - 分页页数（默认10）
 * @param {String} params.field - 排序字段
 * @param {String} params.sorted - 排序规则（asc，desc）
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function webRpList(params) {
  return request({
    url: '/api/v1/prescription/webRpList',
    method: 'get',
    params,
  })
}

// 处方详情 - 处方信息
export function preDetailInfo(params) {
  return request({
    url: '/api/v1/prescription/singleRp',
    method: 'get',
    params,
  })
}

// 详情 - 历史就诊记录
export function hisRecord(params) {
  return request({
    url: '/api/v1/archive/medicalDetail',
    method: 'get',
    params,
  })
}

// 查看处方提交痕迹
export function seeSubRecord(params) {
  return request({
    url: '/api/v1/prescription/rpTrace',
    method: 'get',
    params,
  })
}

// 详情 - 诊疗记录
export function historyMessageList(params) {
  return request({
    url: '/api/v1/im/historyMessageList',
    method: 'get',
    params,
  })
}

// --------------------------------- 机构端 - 订单 - 业务订单 - 订单详情 -----------------

// 本次病例
export function curCase(params) {
  return request({
    url: '/api/v1/etcDisease/findDiseaseByOrderId',
    method: 'get',
    params,
  })
}

// 本次处方
export function curPre(params) {
  return request({
    url: '/api/v1/prescription/rpListInOrderDetail',
    method: 'get',
    params,
  })
}

/*
@name         searchDrugByKeyword          
@desc          
@params       {
                name    string    关键字
                deptId  string    科室id
              }  
@return        
*/
export function searchDrugByKeyword(params) {
  return request({
    url: '/api/v1/orgDrug/listDrug',
    params,
  })
}
/*
@name         searchPharmacyByOrgDrugId      
@desc          
@params        
@return        
*/
export function searchPharmacyByOrgDrugId(params) {
  return request({
    url: '/api/v1/drug/listDrug',
    params,
  })
}
