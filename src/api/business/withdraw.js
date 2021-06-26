import request from '@/utils/request'

// 查询用户信息列表
export function listWithdraw (query) {
  return request({
    url: '/business/withdraw/list',
    method: 'get',
    params: query
  })
}

// 导出用户信息
export function exportWithdraw (query) {
  return request({
    url: '/business/withdraw/export',
    method: 'get',
    params: query
  })
}

// changeStatus
export function changeStatus (data) {
  return request({
    url: '/business/withdraw/changeStatus',
    method: 'POST',
    data: data
  })
}
