import request from '@/utils/request'

// -------------------------------------科室管理--------------------------------------------------------
// ------ 预约挂号科室--------
// 科室名称获取
export function getDepData(params) {
  return request({
    url: '/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

// 科室列表获取
export function getDepList(params) {
  return request({
    url: '/api/v1/dept/list',
    method: 'get',
    params,
  })
}

// 新增科室
export function addDept(data) {
  return request({
    url: '/api/v1/dept/insert',
    method: 'post',
    data,
  })
}

// 编辑科室
export function editDept(data) {
  return request({
    url: '/api/v1/dept/edit',
    method: 'post',
    data,
  })
}

// 变更推荐状态
export function setRecommendState(data) {
  return request({
    url: '/api/v1/dept/changeRecommend',
    method: 'post',
    data,
  })
}

// 变更启用状态
export function setEnableState(data) {
  return request({
    url: '/api/v1/dept/changeState',
    method: 'post',
    data,
  })
}

// 排序
export function sortDept(data) {
  return request({
    url: '/api/v1/dept/changeOrder',
    method: 'post',
    data,
  })
}

// 子科室列表
export function getSonList(params) {
  return request({
    url: '/api/v1/dept/sonList',
    method: 'get',
    params,
  })
}
/* /科室简介相关  start*/
//列表
//title:标题
//status: 不传即不限 true false
export function introList(params) {
  return request({
    url: '/api/v1/dept/intro/list',
    method: 'get',
    params,
  })
}
//新增科室简介
export function introAdd(data) {
  return request({
    url: '/api/v1/dept/intro/add',
    method: 'post',
    data,
  })
}
// 编辑科室简介
export function introEdit(data) {
  return request({
    url: '/api/v1/dept/intro/edit',
    method: 'post',
    data,
  })
}
// 删除科室简介
export function introDelete(data) {
  return request({
    url: `/api/v1/dept/intro/delete/${data}`,
    method: 'post',
    data,
  })
}
// 变更状态
export function introChangeState(data) {
  return request({
    url: `/api/v1/dept/intro/changeState/${data}`,
    method: 'post',
    data,
  })
}
// 变更排序
export function introSeq(data) {
  return request({
    url: '/api/v1/dept/intro/seq',
    method: 'post',
    data,
  })
}
// 获取详情
export function introGet(params) {
  return request({
    url: `/api/v1/dept/intro/get/${params}`,
    method: 'get',
    params,
  })
}
/* end */

/*  */

// ------ 互联网科室--------

// 互联网科室列表
export function deptOuterList(params) {
  return request({
    url: '/api/v1/deptOuter/list',
    method: 'get',
    params,
  })
}

// 新增科室
export function deptOuterAdd(data) {
  return request({
    url: '/api/v1/deptOuter/insert',
    method: 'post',
    data,
  })
}
// 编辑科室
export function deptOuterEdit(data) {
  return request({
    url: '/api/v1/deptOuter/edit',
    method: 'post',
    data,
  })
}
// 父级科室选择列表
export function deptOuterPdeptList(params) {
  return request({
    url: '/api/v1/deptOuter/pDeptList',
    method: 'get',
    params,
  })
}

// 预约挂号科室列表
export function getDeptInner(params) {
  return request({
    url: '/api/v1/deptOuter/getDeptInner',
    method: 'get',
    params,
  })
}
// 变更科室顺序
export function deptOuterChangeOrder(data) {
  return request({
    url: '/api/v1/deptOuter/changeOrder',
    method: 'post',
    data,
  })
}
// 变更启用状态
export function deptOuterChangeState(data) {
  return request({
    url: '/api/v1/deptOuter/changeState',
    method: 'post',
    data,
  })
}
// 变更推荐状态
export function deptOuterChangeRecommend(data) {
  return request({
    url: '/api/v1/deptOuter/changeRecommend',
    method: 'post',
    data,
  })
}
// 获取科室详情
export function deptOuterInfo(params) {
  return request({
    url: '/api/v1/deptOuter/get',
    method: 'get',
    params,
  })
}

// ------ 心咨科室--------
//管理端-心咨科室列表
export function deptXzList(params) {
  return request({
    url: '/api/v1/deptXz/list',
    method: 'get',
    params,
  })
}
//管理端-同步院内科室
export function syncDept(data) {
  return request({
    url: '/api/v1/deptXz/syncDept',
    method: 'post',
    data,
  })
}
//管理端-变更启用状态
export function deptXzChangeState(data) {
  return request({
    url: `/api/v1/deptXz/changeState/${data.id}`,
    method: 'post',
    data,
  })
}
//管理端-编辑
export function deptXzEdit(data) {
  return request({
    url: `/api/v1/deptXz/edit`,
    method: 'post',
    data,
  })
}
//管理端-排序
export function deptXzSeq(data) {
  return request({
    url: `/api/v1/deptXz/seq`,
    method: 'post',
    data,
  })
}
//管理端-删除
export function deptXzDel(data) {
  return request({
    url: `/api/v1/deptXz/del`,
    method: 'post',
    data,
  })
}
//--------------------------------------

// -------------------------------------药房管理--------------------------------------------------------

// 药房列表获取
export function getPharmacyList(params) {
  return request({
    url: '/api/v1/drugStore/list',
    method: 'get',
    params,
  })
}

// 药品列表获取
export function getDrugsList(params) {
  return request({
    url: '/api/v1/drug/pageDrug',
    method: 'get',
    params,
  })
}

// 新增药房
export function addPharmacy(data) {
  return request({
    url: '/api/v1/drugStore/insert',
    method: 'post',
    data,
  })
}

// 编辑药房
export function editPharmacy(data) {
  return request({
    url: '/api/v1/drugStore/edit',
    method: 'post',
    data,
  })
}

// 修改药房状态
export function setPharmacyState(data) {
  return request({
    url: '/api/v1/drugStore/changeState',
    method: 'post',
    data,
  })
}

// 药房排序
export function sortPharmacy(data) {
  return request({
    url: '/api/v1/drugStore/changeOrder',
    method: 'post',
    data,
  })
}

// -------------------------------------职称管理--------------------------------------------------------

// 职称列表获取
export function getTitleList(params) {
  return request({
    url: '/api/v1/title/list',
    method: 'get',
    params,
  })
}

// 新增职称
export function addTitle(data) {
  return request({
    url: '/api/v1/title/insert',
    method: 'post',
    data,
  })
}

// 编辑职称
export function editTitle(data) {
  return request({
    url: '/api/v1/title/edit',
    method: 'post',
    data,
  })
}

// 修改职称状态
export function setTitleState(data) {
  return request({
    url: '/api/v1/title/changeState',
    method: 'post',
    data,
  })
}

// 职称排序
export function sortTitle(data) {
  return request({
    url: '/api/v1/title/changeOrder',
    method: 'post',
    data,
  })
}

//机构端批量导入科室管理
export function batchImport(data) {
  return request({
    url: '/api/v1/dept/importExcel',
    method: 'post',
    timeout: '',
    data,
  })
}
//机构端批量导入互联网科室
export function deptOuterImportExcel(data) {
  return request({
    url: '/api/v1/deptOuter/importExcel',
    method: 'post',
    timeout: '',
    data,
  })
}

//机构端批量导入药房管理
export function pharmacyManagement(data) {
  return request({
    url: '/api/v1/drugStore/importExcel',
    method: 'post',
    timeout: '',
    data,
  })
}

//机构端批量导入 职称管理
export function titleManagement(data) {
  return request({
    url: '/api/v1/title/importExcel',
    method: 'post',
    timeout: '',
    data,
  })
}
