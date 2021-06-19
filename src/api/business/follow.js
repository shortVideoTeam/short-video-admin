import request from '@/utils/request'

// 查询用户关注列表
export function listFollow(query) {
  return request({
    url: '/business/follow/list',
    method: 'get',
    params: query
  })
}

// 查询用户关注详细
export function getFollow(userId) {
  return request({
    url: '/business/follow/' + userId,
    method: 'get'
  })
}

// 新增用户关注
export function addFollow(data) {
  return request({
    url: '/business/follow',
    method: 'post',
    data: data
  })
}

// 修改用户关注
export function updateFollow(data) {
  return request({
    url: '/business/follow',
    method: 'put',
    data: data
  })
}

// 删除用户关注
export function delFollow(userId) {
  return request({
    url: '/business/follow/' + userId,
    method: 'delete'
  })
}

// 导出用户关注
export function exportFollow(query) {
  return request({
    url: '/business/follow/export',
    method: 'get',
    params: query
  })
}
