import request from '@/utils/request'

// 查询点赞记录列表
export function listLove(query) {
  return request({
    url: '/business/love/list',
    method: 'get',
    params: query
  })
}

// 查询点赞记录详细
export function getLove(id) {
  return request({
    url: '/business/love/' + id,
    method: 'get'
  })
}

// 新增点赞记录
export function addLove(data) {
  return request({
    url: '/business/love',
    method: 'post',
    data: data
  })
}

// 修改点赞记录
export function updateLove(data) {
  return request({
    url: '/business/love',
    method: 'put',
    data: data
  })
}

// 删除点赞记录
export function delLove(id) {
  return request({
    url: '/business/love/' + id,
    method: 'delete'
  })
}

// 导出点赞记录
export function exportLove(query) {
  return request({
    url: '/business/love/export',
    method: 'get',
    params: query
  })
}
