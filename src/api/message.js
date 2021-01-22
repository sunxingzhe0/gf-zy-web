import request from '@/utils/request'

// -------------------------------------系统消息-------------------------------------------------------

// 药品列表
export function getSystemInfo(params) {
  return request({
    url: '/api/v1/notice/queryAnyData',
    method: 'get',
    params,
  })
}

// 删除个人消息
export function delSystemInfo(params) {
  return request({
    url: '/api/v1/notice/delNotice',
    method: 'get',
    params,
  })
}

// -------------------------------------公告通知-------------------------------------------------------
