import request from '@/utils/request'


// 查询推广配置列表
export function listConfig (query) {
  return request({
    url: '/business/promote/config/list',
    method: 'get',
    params: query
  })
}

// 查询推广配置详细
export function getConfig (id) {
  return request({
    url: '/business/promote/config/' + id,
    method: 'get'
  })
}

// 新增推广配置
export function addConfig (data) {
  return request({
    url: '/business/promote/config',
    method: 'post',
    data: data
  })
}

// 修改推广配置
export function updateConfig (data) {
  return request({
    url: '/business/promote/config',
    method: 'put',
    data: data
  })
}

// 删除推广配置
export function delConfig (id) {
  return request({
    url: '/business/promote/config/' + id,
    method: 'delete'
  })
}

// 导出推广配置
export function exportConfig (query) {
  return request({
    url: '/business/promote/config/export',
    method: 'get',
    params: query
  })
}
