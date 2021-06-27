import request from '@/utils/request'

// 查询用户信息列表
export function listFunds (query) {
  return request({
    url: '/business/funds/list',
    method: 'get',
    params: query
  })
}

// 导出用户信息
export function exportFunds (query) {
  return request({
    url: '/business/funds/export',
    method: 'get',
    params: query
  })
}

