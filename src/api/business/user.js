import request from '@/utils/request'

// 查询用户信息列表
export function listUser (params) {
  return request({
    url: '/business/user/list',
    method: 'get',
    params
  })
}

// 查询用户信息详细
export function getUser (params) {
  return request({
    url: '/business/user/detail',
    method: 'get',
    params
  })
}

// 新增用户信息
export function addUser (data) {
  return request({
    url: '/business/user',
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function updateUser (data) {
  return request({
    url: '/business/user',
    method: 'put',
    data: data
  })
}

// 删除用户信息
export function delUser (userId) {
  return request({
    url: '/business/user/' + userId,
    method: 'delete'
  })
}

// 导出用户信息
export function exportUser (query) {
  return request({
    url: '/business/user/export',
    method: 'get',
    params: query
  })
}

// changeStatus
export function changeStatus (data) {
  return request({
    url: '/business/user/changeStatus',
    method: 'POST',
    data: data
  })
}
