import request from '@/utils/request'

// ------------------------------------------在线复诊--------------------------------------------------

// 科室排班列表
export function getSchedualList(params) {
  return request({
    url: '/api/v1/schedual/schedualList',
    method: 'get',
    params,
  })
}

// 更改排班状态
export function setStateSchedual(params) {
  return request({
    url: '/api/v1/schedual/changeDeptScheState',
    method: 'get',
    params,
  })
}

// 列表中某一个科室详情进入
export function showInfo(params) {
  return request({
    url: '/api/v1/schedual/findDeptSchedualInfo',
    method: 'get',
    params,
  })
}

// 列表中某一个科室 - 进来的是科室排班设置
export function setTimeState(params) {
  return request({
    url: '/api/v1/schedual/updateTimeState',
    method: 'get',
    params,
  })
}

// 保存
export function deptSave(data) {
  return request({
    url: '/api/v1/schedual/schedualConfig',
    method: 'post',
    data,
  })
}

// 当前科室医生列表
export function getDocList(params) {
  return request({
    url: '/api/v1/schedual/findDocListInThis',
    method: 'get',
    params,
  })
}

// 查询单个医生排班详情
export function getDocDetail(params) {
  return request({
    url: '/api/v1/schedual/findDocScheConfigDetail',
    method: 'get',
    params,
  })
}

// 重置医生排班
export function resetDoc(params) {
  return request({
    url: '/api/v1/schedual/resetDocConfig',
    method: 'get',
    params,
  })
}

// ------------------------------------------机构端排班表--------------------------------------------------

// 医生排班列表
export function getDocSchList(data) {
  return request({
    url: '/api/v1/schedual/findDocSchedualList',
    method: 'post',
    data,
  })
}

// 医生基本信息
export function getSingleDocInfo(params) {
  return request({
    url: '/api/v1/schedual/docInfo',
    method: 'get',
    params,
  })
}

// 医生端的排班信息---------------------------------------------------------------------

// 医生排班日程信息
export function getDocSchInfo(params) {
  return request({
    url: '/api/v1/schedual/singelDocSchedual',
    method: 'get',
    params,
  })
}

// 医生当天排班详情
export function curDayDetail(params) {
  return request({
    url: '/api/v1/schedual/findScheInfoByDate',
    method: 'get',
    params,
  })
}

// 关闭/开启某个时段
export function setTime(params, data) {
  return request({
    url: '/api/v1/schedual/closeSingeRange',
    method: 'post',
    params,
    data,
  })
}
