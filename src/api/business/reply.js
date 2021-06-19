import request from '@/utils/request'

// 查询回复列表
export function listReply(query) {
  return request({
    url: '/business/reply/list',
    method: 'get',
    params: query
  })
}

// 查询回复详细
export function getReply(id) {
  return request({
    url: '/business/reply/' + id,
    method: 'get'
  })
}

// 新增回复
export function addReply(data) {
  return request({
    url: '/business/reply',
    method: 'post',
    data: data
  })
}

// 修改回复
export function updateReply(data) {
  return request({
    url: '/business/reply',
    method: 'put',
    data: data
  })
}

// 删除回复
export function delReply(id) {
  return request({
    url: '/business/reply/' + id,
    method: 'delete'
  })
}

// 导出回复
export function exportReply(query) {
  return request({
    url: '/business/reply/export',
    method: 'get',
    params: query
  })
}
