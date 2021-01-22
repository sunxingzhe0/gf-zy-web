import request from '@/utils/request'

// -------------------------------------科室管理--------------------------------------------------------

// 科室名称获取
export function getDepData(params) {
  return request({
    url: 'zyapi/api/v1/dept/chooseList',
    method: 'get',
    params,
  })
}

// 科室列表获取
export function getDepList(params) {
  return request({
    url: 'zyapi/api/v1/dept/list',
    method: 'get',
    params,
  })
}

export function insertDept(data) {
  return request({
    url: 'zyapi/api/v1/dept/insert',
    method: 'post',
    data,
  })
}

export function editDept(data) {
  return request({
    url: 'zyapi/api/v1/dept/edit',
    method: 'post',
    data,
  })
}

export function getParentDept() {
  return request({
    url: 'zyapi/api/v1/dept/pDeptList',
    method: 'get',
  })
}

export function changeRecommned(data) {
  return request({
    url: 'zyapi/api/v1/dept/changeRecommend',
    method: 'post',
    data,
  })
}

export function changeState(data) {
  return request({
    url: 'zyapi/api/v1/dept/changeState',
    method: 'post',
    data,
  })
}

export function changeOrder(data) {
  return request({
    url: 'zyapi/api/v1/dept/changeOrder',
    method: 'post',
    data,
  })
}

// 员工列表
export function employeeList(params) {
  return request({
    url: 'zyapi/api/v1/employee/list',
    method: 'get',
    params,
  })
}
// 新增员工
export function employeeAdd(data) {
  return request({
    url: 'zyapi/api/v1/employee/insert',
    method: 'post',
    data,
  })
}
// 编辑员工
export function employeeEdit(data) {
  return request({
    url: 'zyapi/api/v1/employee/edit',
    method: 'post',
    data,
  })
}
// 员工获取预编辑信息
export function employeeGet(params) {
  return request({
    url: 'zyapi/api/v1/employee/get',
    method: 'get',
    params,
  })
}
// 员工变更状态
export function employeeChangeState(data) {
  return request({
    url: 'zyapi/api/v1/employee/changeState',
    method: 'post',
    data,
  })
}
// 员工排序
export function employeeChangeOrder(data) {
  return request({
    url: 'zyapi/api/v1/employee/changeOrder',
    method: 'post',
    data,
  })
}
// 员工变更推荐
export function employeeCommend(data) {
  return request({
    url: 'zyapi/api/v1/employee/changeRecommend',
    method: 'post',
    data,
  })
}

// 员工详情
export function doctorIntro(params) {
  return request({
    url: 'zyapi/api/v1/employee/doctorIntro',
    method: 'get',
    params,
  })
}
