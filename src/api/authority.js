import request from '@/utils/request'

// -------------------------------------角色管理--------------------------------------------------------

/**
 * 角色列表获取
 * @param {object} params
 * @param {string} [params.startTime] - 开始时间，示例20200101123030
 * @param {string} [params.endTime] - 结束时间，示例20200303122222
 * @param {string} [params.searchType] - 模糊查询类型：0角色名称
 * @param {string} [params.searchKeywords] - 模糊查询内容
 * @param {string} [params.currentNum] - 当前页码
 * @param {string} [params.pageSize] - 每页数量
 * @param {string} [params.field] - 排序字段
 * @param {string} [params.sorted] - 排序方向
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function roleList(params) {
  return request({
    url: '/api/v1/role/list',
    method: 'get',
    params,
  })
}

/**
 * 新增角色
 * @param {object} data
 * @param {String} data.name - 角色名称
 * @param {boolean} data.state - 角色状态 启用 /禁用 默认启用
 * @param {string[]} data.permissionList - 权限标识id 后台会自动关联 父级id 以及同客户端下一些必选权限如账号管理 密码修改这种
 */
export function roleInsert(data) {
  return request({
    url: '/api/v1/role/insert',
    method: 'POST',
    data,
  })
}

/**
 * 编辑角色
 * @param {object} data
 * @param {String} data.name - 角色名称
 * @param {boolean} data.state - 角色状态 启用 /禁用 默认启用
 * @param {string[]} data.permissionList - 权限标识id 后台会自动关联 父级id 以及同客户端下一些必选权限如账号管理 密码修改这种
 */
export function roleEdit(data) {
  return request({
    url: '/api/v1/role/edit',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} roleGetResponse
 * @property {String} id - 主键id
 * @property {String} name - 角色名称
 * @property {boolean} state - 角色状态 启用 /禁用 默认启用
 * @property {string[]} permissionList - 权限标识id 后台会自动关联 父级id 以及同客户端下一些必选权限如账号管理 密码修改这种
 */

/**
 * 获取角色详情
 * @param {object} params
 * @param {string} params.id - 主键ID
 * @returns {Promise<roleGetResponse>}
 */
export function roleGet(params) {
  return request({
    url: '/api/v1/role/get',
    method: 'get',
    params,
  })
}

/**
 * 删除角色
 * @param {object} data
 * @param {string} data.id - 主键id
 */
export function roleDelete(data) {
  return request({
    url: '/api/v1/role/delete',
    method: 'post',
    data,
  })
}

/**
 * 变更角色状态
 * @param {object} data
 * @param {String} data.id - 主键id
 * @param {boolean} data.state - 角色状态 启用 /禁用 默认禁用
 */
export function roleChangeState(data) {
  return request({
    url: '/api/v1/role/changeState',
    method: 'post',
    data,
  })
}

/**
 * 获取当前登录用户可选权限标识列表
 * @typedef {object} rolePermissionListResponse
 * @property {string} [id] - 权限id
 * @property {string} [pid] - 父级权限id
 * @property {string} [name] - 权限名称
 * @property {string} [value] - 权限标识符 最外层为客户端类型
 * @property {string} [clientType] - 客户端类型
 * @property {string} [cause] - USER("用户端"),DOC_WEB("医生web端"),DOC_MOBILE("医生移动端"),DRUG_DOC("药师端"),DRUG_STORE("药房端"),ORG_WEB("机构管理端"),PLATFORM("平台管理端");
 * @property {string} [itemType] - CLIENT("客户端"),MENU("菜单"),TAG("标签"),ACTION("按钮")
 * @property {rolePermissionListResponse[]} [next] - 下一级权限列表
 *
 * @returns {Promise<rolePermissionListResponse[]>}
 */
export function rolePermissionList() {
  return request({
    url: '/api/v1/role/permissionList',
    method: 'get',
  })
}

/**
 * @typedef {object} Config
 * @property {string} configId - 配置id
 * @property {string} bizType - 业务类型 (CONSULT:在线咨询,REPEAT_CLINIC:在线复诊,CARRYON_PRESC:慢病续方)
 * @property {string} bizWay - 业务形式(GRAPHIC:图文,VIDEO:视频,PHONE:电话)
 * @property {number} bizPrice - 价格
 *
 * @typedef {object} findDocAccountConfig
 * @property {Boolean} custom
 * @property {Config[]} customBiz
 * @property {Config[]} defaultBiz
 *
 * 编辑角色获取业务信息
 * @param {object} params
 * @param {string} params.doctorId
 * @returns {Promise<findDocAccountConfig>}
 */
export function findDocAccountConfig(params) {
  return request({
    url: '/api/v1/bizConfig/findDocAccountConfig',
    method: 'get',
    params,
  })
}

/**
 * 账号列表
 * @param {object} params
 * @param {string} [params.timeType] -  时间类型 0创建时间 1最后登录时间 2认证时间 3实名时间
 * @param {string} [params.startTime] - 开始时间，示例20200101123030
 * @param {string} [params.endTime] - 结束时间，示例20200303122222
 * @param {string} [params.searchType] - 模糊查询类型：0姓名 1工号 2员工账号
 * @param {string} [params.searchKeywords] - 模糊查询内容
 * @param {string} [params.employeeType] - 员工账号类型DOCTOR("医生")DRUGER("药师")NURSE("护士")OTHER("其他")
 * @param {string} [params.roleId] - 角色id
 * @param {string} [params.sex] - 性别0女1男
 * @param {string} [params.deptId] - 科室id
 * @param {string} [params.storeId] - 药房id
 * @param {string} [params.titleId] - 职称id
 * @param {string} [params.recommend] - 是否推荐 不限/false 禁用/true启用
 * @param {string} [params.state] - 状态 不限/false 禁用/true启用
 * @param {string} [params.business] - 业务自定义 不限/false 禁用/true启用
 * @param {string} [params.auth] - 实名 不限/false 未实名/ true已实名
 * @param {string} [params.examineState] - 审核状态 TO_CONFIRM("待确认")SUCCESS("是")FAIL("否")TO_EXAMINE("待审核")
 * @param {string} [params.businessType] - 业务范围 CONSULT("在线咨询")REPEAT_CLINIC("在线复诊")CARRYON_PRESC("慢病续方")
 * @param {string} [params.consultType] - 业务范围  GRAPHIC("图文")VIDEO("视频"),PHONE("电话")
 * @param {string} [params.diagNumStart] - 诊疗次数开始
 * @param {string} [params.diagNumEnd] - 诊疗次数结束
 * @param {string} [params.scoreStart] - 评分数目范围开始
 * @param {string} [params.scoreEnd] - 评分数目范围结束
 * @param {string} [params.currentNum] - 当前页码
 * @param {string} [params.pageSize] - 每页数量
 * @param {string} [params.field] - 排序字段
 * @param {string} [params.sorted] - 排序方向
 * @returns {Promise<import('./index').ListBase & { list: {}[] }>}
 */
export function accountList(params) {
  return request({
    url: '/api/v1/account/list',
    method: 'get',
    params,
  })
}

/**
 * @typedef {object} Cart
 * @property {string[]} data.fileId - 图片id 列表
 * @property {String} data.type - 证书类型 DRUG("药师资格证"),PHYS_QUAL("医师资格证"),DOCTOR_QUAL("医师执业证"),NURSE("护士执业证"),TECH("专业技术资格证")
 * @property {String} data.certNo - 证书编号
 * @property {String} [data.practiceOrg] - 执业单位
 *
 * 新增账号
 * @param {object} data
 * @param {string[]} data.roleId - 角色
 * @param {String} data.name - 姓名
 * @param {number} data.sex - 0女 1男 如果填写了身份证 就跟身份证走
 * @param {String} data.account - 用户账号
 * @param {String} data.password - 用户密码
 * @param {String} [data.phone] - 手机号
 * @param {String} [data.idCard] - 身份证号
 * @param {String} data.type - 账号类型 DOCTOR("医生"),DRUGER("药师"),NURSE("护士"),OTHER("其他")
 * @param {String} [data.defDeptId] - 默认科室id
 * @param {string[]} [data.deptId] - 关联科室
 * @param {string[]} [data.storeId] - 关联药房
 * @param {String} data.titleId - 职称id
 * @param {String} data.workNo - 工号
 * @param {String} data.workHistory - 工作年限
 * @param {String} data.mail - 邮箱地址
 * @param {Boolean} data.recommend - 是否推荐
 * @param {Boolean} data.inHospital - 是否为本院
 * @param {String} data.intro - 0-1000简介
 * @param {String} data.practiceInfo - 0-1000执业经历
 * @param {String} data.practiceArea - 0-1000执业范围
 * @param {String} data.academicInfo - 0-1000学术经历
 * @param {Cart[]} data.certs - 证书列表
 */
export function accountInsert(data) {
  return request({
    url: '/api/v1/account/insert',
    method: 'post',
    data,
  })
}

/**
 * @typedef {object} accountGetResponse
 * @property {string} id - 主键
 * @property {string[]} roleId - 角色
 * @property {{ id: string, name: string }[]} roleInfo
 * @property {string} workerCode
 * @property {String} name - 姓名
 * @property {number} sex - 0女 1男 如果填写了身份证 就跟身份证走
 * @property {String} account - 用户账号
 * @property {String} [phone] - 手机号
 * @property {String} [idCard] - 身份证号
 * @property {String} type - 账号类型 DOCTOR("医生"),DRUGER("药师"),NURSE("护士"),OTHER("其他")
 * @property {String} [defDeptId] - 默认科室id
 * @property {string[]} [deptId] - 关联科室
 * @property {{ id: string, name: string }[]} deptInfo
 * @property {string[]} [storeId] - 关联药房
 * @property {{ id: string, name: string }[]} storeInfo
 * @property {String} titleId - 职称id
 * @property {string} titleInfo
 * @property {String} workNo - 工号
 * @property {String} workHistory - 工作年限
 * @property {String} mail - 邮箱地址
 * @property {Boolean} recommend - 是否推荐
 * @property {Boolean} inHospital - 是否为本院
 * @property {String} intro - 0-1000简介
 * @property {String} practiceInfo - 0-1000执业经历
 * @property {String} practiceArea - 0-1000执业范围
 * @property {String} academicInfo - 0-1000学术经历
 * @property {boolean} state
 * @property {boolean} examine
 * @property {Cart[]} certs - 证书列表
 *
 * 获取账号详情
 * @param {object} params
 * @param {string} params.id - 主键
 * @returns {Promise<accountGetResponse>}
 */
export function accountGet(params) {
  return request({
    url: '/api/v1/account/get',
    method: 'get',
    params,
  })
}

/**
 * 编辑账号
 * @param {object} data
 * @param {string} data.id
 * @param {string[]} data.roleId - 角色
 * @param {String} data.name - 姓名
 * @param {number} data.sex - 0女 1男 如果填写了身份证 就跟身份证走
 * @param {String} data.account - 用户账号
 * @param {String} data.password - 用户密码
 * @param {String} [data.phone] - 手机号
 * @param {String} [data.idCard] - 身份证号
 * @param {String} data.type - 账号类型 DOCTOR("医生"),DRUGER("药师"),NURSE("护士"),OTHER("其他")
 * @param {String} [data.defDeptId] - 默认科室id
 * @param {string[]} [data.deptId] - 关联科室
 * @param {string[]} [data.storeId] - 关联药房
 * @param {String} data.titleId - 职称id
 * @param {String} data.workNo - 工号
 * @param {String} data.workHistory - 工作年限
 * @param {String} data.mail - 邮箱地址
 * @param {Boolean} data.recommend - 是否推荐
 * @param {Boolean} data.inHospital - 是否为本院
 * @param {String} data.intro - 0-1000简介
 * @param {String} data.practiceInfo - 0-1000执业经历
 * @param {String} data.practiceArea - 0-1000执业范围
 * @param {String} data.academicInfo - 0-1000学术经历
 */
export function accountEdit(data) {
  return request({
    url: '/api/v1/account/edit',
    method: 'post',
    data,
  })
}

/**
 * 重置实名信息
 * @param {object} data
 * @param {string} data.id
 */
export function accountResetAuth(data) {
  return request({
    url: '/api/v1/account/resetAuth',
    method: 'post',
    data,
  })
}

/**
 * 重置手机号绑定信息
 * @param {object} data
 * @param {string} data.id
 */
export function accountResetPhoneBind(data) {
  return request({
    url: '/api/v1/account/resetPhoneBind',
    method: 'post',
    data,
  })
}
/**
 * 重置密码
 * @param {object} data
 * @param {string} data.id
 * @param {string} data.password
 */
export function accountResetPassword(data) {
  return request({
    url: '/api/v1/account/resetPassword',
    method: 'post',
    data,
  })
}

/**
 * 变更启用状态
 * @param {object} data
 * @param {String} data.id - 主键
 * @param {Boolean} data.state - true启用 /false禁用
 */
export function accountChangeState(data) {
  return request({
    url: '/api/v1/account/changeState',
    method: 'post',
    data,
  })
}

/**
 * 变更推荐状态
 * @param {object} data
 * @param {String} data.id - 主键
 * @param {Boolean} data.recommend - true启用 /false禁用
 */
export function accountChangeRecommend(data) {
  return request({
    url: '/api/v1/account/changeRecommend',
    method: 'post',
    data,
  })
}

/**
 * 变更推荐状态
 * @param {object} params
 * @param {String} params.docId - 医生id
 * @param {Boolean} params.custom - 	自定义标识 0关闭自定义 /1开启自定义
 */
export function updateAccountBizState(params) {
  return request({
    url: '/api/v1/bizConfig/updateAccountBizState',
    method: 'get',
    params,
  })
}

/**
 * 变更明星专家
 * @param {object} params
 * @param {String} params.id - 医生id
 * @param {Boolean} params.star - 	true启用 /false禁用
 */
export function updateChangeStar(data) {
  return request({
    url: '/api/v1/account/changeStar',
    method: 'post',
    data,
  })
}

/**
 * 变更排序
 * @param {object} data
 * @param {String} data.id - 主键
 * @param {number} data.seq - 序号
 */
export function accountChangeOrder(data) {
  return request({
    url: '/api/v1/account/changeOrder',
    method: 'post',
    data,
  })
}

/**
 * 审核资质
 * @param {object} data
 * @param {String} data.id - 主键
 * @param {boolean} data.examine - 审核结果 true 通过 false不通过
 * @param {String} data.examineReason - 失败原因
 */
export function accountExamine(data) {
  return request({
    url: '/api/v1/account/examine',
    method: 'post',
    data,
  })
}

/**
 * 重置资质审核
 * @param {object} data
 * @param {string} data.id
 */
export function accountResetExamine(data) {
  return request({
    url: '/api/v1/account/resetExamine',
    method: 'post',
    data,
  })
}

/**
 * 医生评论列表
 */
export function findEvaluateData(params) {
  return request({
    url: '/api/v1/evaluate/findEvaluateDataList',
    method: 'get',
    params,
  })
}

/**
 * 解锁账号
 */
export function removeLoginLock(data) {
  return request({
    url: '/api/v1/account/removeLoginLock',
    method: 'post',
    data,
  })
}
