import request from '@/utils/request'

// --------------------------------------------------机构--------------------------------------

// ----------------医院介绍--------------------

// 基本信息
export function hosInfo(params) {
  return request({
    url: '/api/v1/org/get',
    method: 'get',
    params,
  })
}

// 编辑信息
export function edithosInfo(data) {
  return request({
    url: '/api/v1/org/edit',
    method: 'post',
    data,
  })
}

// 获取机构文本
export function getDeptInfo(params) {
  return request({
    url: '/api/v1/org/getText',
    method: 'get',
    params,
  })
}

// 编辑机构文本
export function editDeptInfo(data) {
  return request({
    url: '/api/v1/org/editText',
    method: 'post',
    data,
  })
}
