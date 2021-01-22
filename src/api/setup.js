import request from '@/utils/request'

/*
 *
 * ------------------------------------------------机构端的设置-------------------------------------------
 *
 */

// -------------------------------------广告轮播--------------------------------------------------------

// 广告列表获取
export function getAdList(params) {
  return request({
    url: '/api/v1/advertising/queryData',
    method: 'get',
    params,
  })
}

// 删除广告
export function delAds(data) {
  return request({
    url: '/api/v1/advertising/setAdvertisingDel',
    method: 'post',
    data,
  })
}

// 新增广告
export function addNewad(data) {
  return request({
    url: '/api/v1/advertising/addAndEdit',
    method: 'post',
    data,
  })
}

// 编辑广告
export function editAd(data) {
  return request({
    url: '/api/v1/advertising/editAdvertising',
    method: 'post',
    data,
  })
}

// 修改广告状态
export function setAdState(data) {
  return request({
    url: '/api/v1/advertising/setAdvertisingState',
    method: 'post',
    data,
  })
}

// 广告排序
export function sortAd(params) {
  return request({
    url: '/api/v1/advertising/editAdvertingSeq',
    method: 'get',
    params,
  })
}

// -------------------------------------公告管理--------------------------------------------------------

// 公告列表获取
export function getAnnounceList(params) {
  return request({
    url: '/api/v1/announce/announceList',
    method: 'get',
    params,
  })
}

// 删除公告
export function delAnn(params) {
  return request({
    url: '/api/v1/announce/delAnnounce',
    method: 'get',
    params,
  })
}

// 公告排序
export function SortAnn(params) {
  return request({
    url: '/api/v1/advertising/editAdvertingSeq',
    method: 'get',
    params,
  })
}

// 新增公告--角色选择
export function chooseRoles(params) {
  return request({
    url: '/api/v1/role/chooseList',
    method: 'get',
    params,
  })
}

// 新增公告--科室选择
export function selDepartment(params) {
  return request({
    url: '/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

// 公告详情
export function detailAnn(params) {
  return request({
    url: '/api/v1/announce/queryAnnounce',
    method: 'get',
    params,
  })
}

// 公告隐藏与显示
export function showAnn(params) {
  return request({
    url: '/api/v1/announce/stateAnnounce',
    method: 'get',
    params,
  })
}

// 编辑公告
export function editAnn(data) {
  return request({
    url: '/api/v1/announce/editAnnounce',
    method: 'post',
    data,
  })
}

// 新增公告
export function addAnn(data) {
  return request({
    url: '/api/v1/announce/addAnnounce',
    method: 'post',
    data,
  })
}

// 发布公告
export function sendAnn(params) {
  return request({
    url: '/api/v1/announce/sendAnnounce',
    method: 'get',
    params,
  })
}
// -------------------------------------首页栏目--------------------------------------------------------

// 首页栏目列表获取
export function getColumnList(params) {
  return request({
    url: '/api/v1/column/queryData',
    method: 'get',
    params,
  })
}

// 删除栏目
export function delCol(data) {
  return request({
    url: '/api/v1/column/setColumnDel',
    method: 'post',
    data,
  })
}

// 新增栏目
export function addNewCol(data) {
  return request({
    url: '/api/v1/column/addColumn',
    method: 'post',
    data,
  })
}

// 编辑栏目
export function editCol(data) {
  return request({
    url: '/api/v1/column/editColumn',
    method: 'post',
    data,
  })
}

// 修改栏目状态
export function setColState(data) {
  return request({
    url: '/api/v1/column/setColumnState',
    method: 'post',
    data,
  })
}

// 栏目排序
export function sortCol(params) {
  return request({
    url: '/api/v1/column/editColumnSeq',
    method: 'get',
    params,
  })
}

// 栏目标题显示
export function titleCol(params) {
  return request({
    url: '/api/v1/column/findColumnTitle',
    method: 'get',
    params,
  })
}

// 栏目标题编辑
export function editTitleCol(params) {
  return request({
    url: '/api/v1/column/updateTitle',
    method: 'get',
    params,
  })
}

//-------------------------------------------资讯管理--------------------------------------------------

// 资讯列表获取
export function getInfoList(params) {
  return request({
    url: '/api/v1/information/showInformation',
    method: 'get',
    params,
  })
}

// 删除资讯
export function delInfo(data) {
  return request({
    url: '/api/v1/information/deleteInformation',
    method: 'post',
    data,
  })
}

// 资讯排序
export function sortInfo(params) {
  return request({
    url: 'api/v1/information/editInformationSeq',
    method: 'get',
    params,
  })
}

// 修改资讯状态
export function setInfoState(data) {
  return request({
    url: '/api/v1/information/editInformationState',
    method: 'post',
    data,
  })
}

// 查看资讯详情
export function infoDetail(params) {
  return request({
    url: '/api/v1/information/informationDetails',
    method: 'get',
    params,
  })
}

// 新增资讯
export function addInfo(data) {
  return request({
    url: '/api/v1/information/addInformation',
    method: 'post',
    data,
  })
}

// 编辑资讯
export function editInfo(data) {
  return request({
    url: '/api/v1/information/editInformation',
    method: 'post',
    data,
  })
}

//-------------------------------------------协议管理--------------------------------------------------

// 查看协议
export function getAgrList(params) {
  return request({
    url: '/api/v1/agreement/showAgreement',
    method: 'get',
    params,
  })
}

// 添加协议
export function addAgreement(data) {
  return request({
    url: '/api/v1/agreement/addAgreement',
    method: 'post',
    data,
  })
}

// 编辑协议
export function editArg(data) {
  return request({
    url: '/api/v1/agreement/editAgreement',
    method: 'post',
    data,
  })
}

//-------------------------------------------业务设置--------------------------------------------------

// 业务设置列表
export function getBusSetList(params) {
  return request({
    url: '/api/v1/bizConfig/findModuleConfig',
    method: 'get',
    params,
  })
}

// 修改业务
export function modifyBus(params, data) {
  return request({
    url: '/api/v1/bizConfig/updateModuleConfig',
    method: 'post',
    params,
    data,
  })
}

// 日志
export function editBusSet(params) {
  return request({
    url: '/api/v1/logger/loggerBillData',
    method: 'get',
    params,
  })
}

//-------------------------------------------日志管理--------------------------------------------------

// 日志管理列表
export function getLogList(params) {
  return request({
    url: '/api/v1/logger/loggerManageData',
    method: 'get',
    params,
  })
}

// 单据操作日志
export function getSingleLog(params) {
  return request({
    url: '/api/v1/logger/loggerBillData',
    method: 'get',
    params,
  })
}

/*
 *
 * ------------------------------------------------药房端的设置-------------------------------------------
 *
 */

//  ------------------------------------------业务设置------------------------------------------

// // 业务设置列表
// export function getBusinessList(params) {
//   return request({
//     url: '/api/v1/bizConfig/findModuleConfig',
//     method: 'get',
//     params,
//   })
// }

/*
 *
 * ------------------------------------------------医生端的设置-------------------------------------------
 *
 */

//  ----------------------------------------业务设置----------------------------------------------

// 查询业务设置

export function getDocSet(params) {
  return request({
    url: '/api/v1/bizConfig/docFindMyConfig',
    method: 'get',
    params,
  })
}

// 修改业务
export function editDocBus(data) {
  return request({
    url: '/api/v1/bizConfig/updateMyConfig',
    method: 'post',
    data,
  })
}

// ---------------------个人信息--------------

// --------账号信息

//修改密码
export function editPassword(data) {
  return request({
    url: '/api/v1/login/changePassword',
    method: 'post',
    data,
  })
}

//旧密码预校验
export function checkOldPwd(data) {
  return request({
    url: '/api/v1/login/validatePwd',
    method: 'post',
    data,
  })
}

//修改手机号
export function editPhone(data) {
  return request({
    url: '/api/v1/login/changePhone',
    method: 'post',
    data,
  })
}
//初次手机号
export function firstBindPhone(data) {
  return request({
    url: '/api/v1/wxLogin/firstBindPhone',
    method: 'post',
    data,
  })
}

//手机号更换核身回调 调用2后 执行完人脸认证流程使用biztoken调用 （测试阶段可以不执行人脸验证流程）
export function finishResetPhone(params) {
  return request({
    url: '/api/v1/wxLogin/finishResetPhone',
    method: 'get',
    params,
  })
}
//初次绑定
export function finishFirstBindPhone(params) {
  return request({
    url: '/api/v1/wxLogin/finishFirstBindPhone',
    method: 'get',
    params,
  })
}

// 发送验证码解绑
export function changePhone(data) {
  return request({
    url: '/api/v1/login/verificationCode',
    method: 'post',
    data,
  })
}

// 预校验验证码
export function checkPhoneCode(data) {
  return request({
    url: '/api/v1/login/validateCode',
    method: 'post',
    data,
  })
}

// --------基本信息

// 修改头像
export function changeAvater(data) {
  return request({
    url: '/api/v1/login/changeAvatar',
    method: 'post',
    data,
  })
}

// 实名信息
export function getRealInfo(params) {
  return request({
    url: 'api/v1/account/doctorAuthInfo',
    method: 'get',
    params,
  })
}
// 实名制小程序二维码
export function miniImg() {
  return request({
    url: '/api/v1/account/miniImg',
    method: 'get',
  })
}
// 资格证书
export function quaCert(params) {
  return request({
    url: '/api/v1/account/selfQualAuth',
    method: 'get',
    params,
  })
}
// 医生信息
// id	string	医生id
export function doctorIntro(params) {
  return request({
    url: '/api/v1/account/doctorIntro',
    method: 'get',
    params,
  })
}
// 修改医生信息
// id	string	医生id
export function changeSelfText(data) {
  return request({
    url: '/api/v1/login/changeSelfText',
    method: 'POST',
    data,
  })
}

// 编辑资格证书
export function saveQualAuth(data) {
  return request({
    url: '/api/v1/account/sendQualAuth',
    method: 'POST',
    data,
  })
}
// 撤回资质认证证书
export function recall() {
  return request({
    url: '/api/v1/account/recall',
    method: 'get',
  })
}
// 科室拉取
export function deptList(params) {
  return request({
    url: '/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

// 职称拉取
export function titleList(params) {
  return request({
    url: '/api/v1/title/chooseList',
    method: 'get',
    params,
  })
}

// --------------------------------------公共接口--------------------------------

// 公告通知列表
export function anNotice(params) {
  return request({
    url: '/api/v1/announce/announceAnyData',
    method: 'get',
    params,
  })
}

// 公告一键已读
export function readAll(params) {
  return request({
    url: '/api/v1/announce/batchReadAnnounce',
    method: 'get',
    params,
  })
}

// 公告已读
export function read(params) {
  return request({
    url: '/api/v1/announce/readAnnounce',
    method: 'get',
    params,
  })
}

// 单据操作日志
export function singleLog(params) {
  return request({
    url: '/api/v1/logger/loggerBillData',
    method: 'get',
    params,
  })
}
