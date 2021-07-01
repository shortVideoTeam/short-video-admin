import request from '@/utils/request'

// 查询红包金额配置列表
export function listConfig (params) {
  return request({
    url: '/business/walleConfig/list',
    method: 'get',
    params: params
  })
}

// 查询红包金额配置详细
export function getConfig (id) {
  return request({
    url: '/business/walleConfig/' + id,
    method: 'get'
  })
}

// 新增红包金额配置
export function addConfig (data) {
  return request({
    url: '/business/walleConfig',
    method: 'post',
    data: data
  })
}

// 修改红包金额配置
export function updateConfig (data) {
  return request({
    url: '/business/walleConfig',
    method: 'put',
    data: data
  })
}

// 删除红包金额配置
export function delConfig (id) {
  return request({
    url: '/business/walleConfig/' + id,
    method: 'delete'
  })
}

// 导出红包金额配置
export function exportConfig (query) {
  return request({
    url: '/business/walleConfig/export',
    method: 'get',
    params: query
  })
}
