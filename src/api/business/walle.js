import request from '@/utils/request'

// 查询红包金额配置列表
export function listConfig (query) {
  return request({
    url: '/business/walle/list',
    method: 'get',
    params: query
  })
}

// 查询红包金额配置详细
export function getConfig (id) {
  return request({
    url: '/business/walle/' + id,
    method: 'get'
  })
}

// 新增红包金额配置
export function addConfig (data) {
  return request({
    url: '/business/walle',
    method: 'post',
    data: data
  })
}

// 修改红包金额配置
export function updateConfig (data) {
  return request({
    url: '/business/walle',
    method: 'put',
    data: data
  })
}

// 删除红包金额配置
export function delConfig (id) {
  return request({
    url: '/business/walle/' + id,
    method: 'delete'
  })
}

// 导出红包金额配置
export function exportConfig (query) {
  return request({
    url: '/business/walle/export',
    method: 'get',
    params: query
  })
}
