import request from '@/utils/request'

// 查询邀请记录列表
export function listInvite(query) {
  return request({
    url: '/business/invite/list',
    method: 'get',
    params: query
  })
}

// 查询邀请记录详细
export function getInvite(id) {
  return request({
    url: '/business/invite/' + id,
    method: 'get'
  })
}

// 新增邀请记录
export function addInvite(data) {
  return request({
    url: '/business/invite',
    method: 'post',
    data: data
  })
}

// 修改邀请记录
export function updateInvite(data) {
  return request({
    url: '/business/invite',
    method: 'put',
    data: data
  })
}

// 删除邀请记录
export function delInvite(id) {
  return request({
    url: '/business/invite/' + id,
    method: 'delete'
  })
}

// 导出邀请记录
export function exportInvite(query) {
  return request({
    url: '/business/invite/export',
    method: 'get',
    params: query
  })
}
