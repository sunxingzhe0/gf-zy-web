import request from '@/utils/request'

/**
 * 添加常用语
 * @param {object} data
 * @param {string} data.content - 常用语内容
 * @returns {Promise<''>}
 */
export function addTemplate(data) {
  return request({
    url: '/api/v1/phrase/addTemplate',
    method: 'post',
    data,
  })
}

/**
 * 编辑常用语
 * @param {object} data
 * @param {string} data.id - 主键ID
 * @param {string} data.content - 常用语内容
 * @returns {Promise<''>}
 */
export function editTemplate(data) {
  return request({
    url: '/api/v1/phrase/editTemplate',
    method: 'post',
    data,
  })
}

/**
 * 常用语列表显示
 * @param {object} params
 * @param {string} [params.startTime] - 开始时间
 * @param {string} [params.endTime] - 结束时间
 * @param {string} [params.searchKeyWords] - 内容
 * @param {string} [params.startNum] - 开始数量
 * @param {string} [params.endTime] - 结束数量
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function findTemplateData(params) {
  return request({
    url: '/api/v1/phrase/findTemplateData',
    method: 'get',
    params,
  })
}

/**
 * 删除常用语
 * @param {object} params
 * @param {string} params.id - 常用语ID
 * @returns {Promise<''>}
 */
export function delTemplate(params) {
  return request({
    url: '/api/v1/phrase/delTemplate',
    method: 'get',
    params,
  })
}

/**
 * 常用语使用次数变更
 * @param {object} params
 * @param {string} params.id - 常用语ID
 * @returns {Promise<''>}
 */
export function updateTemplateNum(params) {
  return request({
    url: '/api/v1/phrase/updateTemplateNum',
    method: 'get',
    params,
  })
}

/**
 * 新增病历模板
 * @param {object} data
 * @param {string} data.tempName - 模板名称
 * @param {string} [data.tempDesc] - 模板描述
 * @param {string} [data.mainSuit] - 主诉
 * @param {string} [data.nowDisease] - 现病史
 * @param {string} [data.hisDisease] - 既往史
 * @param {string} [data.phyCheck] - 体格检查
 * @param {string} [data.supCheck] - 辅助检查
 * @param {string} [data.dealIdea] - 处理意见
 * @returns {Promise<''>}
 */
export function addEtcDiseaseTemp(data) {
  return request({
    url: '/api/v1/etcDisease/addEtcDiseaseTemp',
    method: 'post',
    data,
  })
}

/**
 * 编辑病历模板
 * @param {object} data
 * @param {string} data.tempId - 模板id
 * @param {string} data.tempName - 模板名称
 * @param {string} [data.tempDesc] - 模板描述
 * @param {string} [data.mainSuit] - 主诉
 * @param {string} [data.nowDisease] - 现病史
 * @param {string} [data.phyCheck] - 体格检查
 * @param {string} [data.supCheck] - 辅助检查
 * @param {string} [data.dealIdea] - 处理意见
 * @returns {Promise<''>}
 */
export function updateEtcDiseaseTemp(data) {
  return request({
    url: '/api/v1/etcDisease/updateEtcDiseaseTemp',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} backDiseaseTempInfoResponse
 * @property {string} templateId - 模板id
 * @property {string} tempName - 模板名称
 * @property {string} [tempDesc] - 模板描述
 * @property {string} [mainSuit] - 主诉
 * @property {string} [nowDisease] - 现病史
 * @property {string} [phyCheck] - 体格检查
 * @property {string} [supCheck] - 辅助检查
 * @property {string} [dealIdea] - 处理意见
 */

/**
 * 查询病历模板信息
 * @param {object} params
 * @param {string} params.templateId - 模板ID
 * @returns {Promise<backDiseaseTempInfoResponse>}
 */
export function backDiseaseTempInfo(params) {
  return request({
    url: '/api/v1/etcDisease/backDiseaseTempInfo',
    method: 'get',
    params,
  })
}

/**
 * 病历模板列表
 * @param {object} data
 * @param {number} [data.timeType] - 时间类型(0:创建时间)
 * @param {string} [data.startTime] - 开始时间 格式20200520121212
 * @param {string} [data.endTime] - 结束时间
 * @param {number} [data.searchType] - 关键字类型 (0:模板名称/1:模板描述)
 * @param {string} [data.searchKeyWords] - 关键字内容
 * @param {number} [data.startUse] - 使用次数-开始
 * @param {number} [data.endUse] - 使用次数-结束
 * @param {number} [data.currentNum] - 当前页
 * @param {number} [data.pageSize] - 每页内容数
 * @param {string} [data.field] - 排序字段
 * @param {string} [data.sorted] - 排序方向
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function findDiseaseTemplateList(data) {
  return request({
    url: '/api/v1/etcDisease/findDiseaseTemplateList',
    method: 'post',
    data,
  })
}

/**
 * 删除|批量删除病历模板
 * @param {object} params
 * @param {string} params.templateId - 模板id(多个之间用逗号隔开)
 * @returns {Promise<''>}
 */
export function deleteEtcDiseaseTemp(params) {
  return request({
    url: '/api/v1/etcDisease/deleteEtcDiseaseTemp',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} rpDrug
 * @property {number} seq - 序号
 * @property {String} type - 药品类型(WESTERN_MEDICINE, "西药"),(CHINESE_PATENT_MEDICINE, "中成药"),(HERBS, "草药"),
 * @property {String} name - 药品名称
 * @property {String} spec - 规格
 * @property {String} total - 总量
 * @property {String} price - 单价
 * @property {String} remark - 备注
 * @property {String} useWays - 用药途径
 * @property {String} medicare - 医保("A", "甲"),("B", "乙"),("C", "丙"),("ME_FEE", "自费"),
 * @property {String} singleDose - 单次剂量
 * @property {String} totalPrice - 总价
 * @property {String} useFrequency - 用药频次
 * @property {String} orgDrugId - 机构药品id
 *
 * 处方模板新增
 * @param {object} data
 * @param {String} data.name - 模版名称
 * @param {String} data.remark - 描述
 * @param {String} data.icdId - 诊断字典id
 * @param {String} data.icdName - 病种
 * @param {rpDrug[]} data.rpDrugList
 * @returns {Promise<string>} 模板ID
 */
export function saveRpTemplate(data) {
  return request({
    url: '/api/v1/prescription/saveRpTemplate',
    method: 'post',
    data,
  })
}

/**
 * 处方模板编辑
 * @param {object} data
 * @param {String} data.name - 模版名称
 * @param {String} data.remark - 描述
 * @param {String} data.icdId - 诊断字典id
 * @param {String} data.icdName - 病种
 * @param {rpDrug[]} data.rpDrugList
 * @returns {Promise<string>} 模板ID
 */
export function editRpTemplate(data) {
  return request({
    url: '/api/v1/prescription/editRpTemplate',
    method: 'post',
    data,
  })
}

/**
 * 处方模板分页查询
 * @param {object} params
 * @param {string} [params.searchKeywords] - 模版名称关键字
 * @param {number} [params.currentNum] - 分页页码（默认1）
 * @param {number} [params.pageSize] - 分页页数（默认10）
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function webPageRpTemplateList(params) {
  return request({
    url: '/api/v1/prescription/webPageRpTemplateList',
    method: 'get',
    params,
  })
}

/**
 * 处方模板删除
 * @param {object} data
 * @param {string} data.id
 */
export function delRpTemplate(data) {
  return request({
    url: '/api/v1/prescription/delRpTemplate',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} singleRpTemplateResponse
 * @property {String} id - 主键id
 * @property {String} name - 模版名称
 * @property {String} remark - 描述
 * @property {String} icdId - 诊断字典id
 * @property {String} icdName - 病种
 * @property {Integer} number - 药品数量
 * @property {rpDrug[]} rpDrugList
 * @property {string} westPrice
 * @property {string} chPatentPrice
 * @property {string} price
 *
 * 处方模板详情
 * @param {object} params
 * @param {string} params.id
 * @returns {Promise<singleRpTemplateResponse>}
 */
export function singleRpTemplate(params) {
  return request({
    url: '/api/v1/prescription/singleRpTemplate',
    method: 'get',
    params,
  })
}

// -----------------------------------药师模板-驳回原因----------------------------

// 列表查询
export function getRejectList(params) {
  return request({
    url: '/api/v1/prescription/pageRefuse',
    method: 'get',
    params,
  })
}

// 新增模板
export function addReject(data) {
  return request({
    url: '/api/v1/prescription/saveRefuse',
    method: 'post',
    data,
  })
}

// 编辑模板
export function editReject(data) {
  return request({
    url: '/api/v1/prescription/editRefuse',
    method: 'post',
    data,
  })
}

// 删除模板
export function delReject(data) {
  return request({
    url: '/api/v1/prescription/delRefuse',
    method: 'post',
    data,
  })
}

// --------------------------诊断模板--------------------------------

// 诊断模板列表
export function findDiagTempList(data) {
  return request({
    url: '/api/v1/diagnosis/findDiagTempList',
    method: 'get',
    params: data,
  })
}

// 添加诊断模板
export function addDiagTemp(data) {
  return request({
    url: '/api/v1/diagnosis/addDiagTemp',
    method: 'post',
    data,
  })
}
// 删除诊断模板
export function deleteDiagTemp(data) {
  return request({
    url: '/api/v1/diagnosis/deleteDiagTemp',
    method: 'post',
    data,
  })
}
// 查询诊断模板信息
export function findDiagTempInfo(data) {
  return request({
    url: '/api/v1/diagnosis/findDiagTempInfo',
    method: 'get',
    params: data,
  })
}

// 删除诊断模板
export function updateDiagTemp(data) {
  return request({
    url: '/api/v1/diagnosis/updateDiagTemp',
    method: 'post',
    data,
  })
}
