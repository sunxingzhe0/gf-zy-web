import request from '@/utils/request'

// 获取院区列表
export function getHospList(params) {
  return request({
    url: 'zyapi/api/v1/org/getHospList',
    method: 'get',
    params,
  })
}

// 编辑院区信息
export function editHospInfo(data) {
  return request({
    url: 'zyapi/api/v1/org/editHospInfo',
    method: 'post',
    data,
  })
}

// 编辑院区状态
export function editHospType(data) {
  return request({
    url: 'zyapi/api/v1/org/editHospType',
    method: 'post',
    data,
  })
}
