import request from '@/utils/request'

// 查询音乐模板列表
export function listMiusic(query) {
  return request({
    url: '/business/miusic/list',
    method: 'get',
    params: query
  })
}

// 查询音乐模板详细
export function getMiusic(id) {
  return request({
    url: '/business/miusic/' + id,
    method: 'get'
  })
}

// 新增音乐模板
export function addMiusic(data) {
  return request({
    url: '/business/miusic',
    method: 'post',
    data: data
  })
}

// 修改音乐模板
export function updateMiusic(data) {
  return request({
    url: '/business/miusic',
    method: 'put',
    data: data
  })
}

// 删除音乐模板
export function delMiusic(id) {
  return request({
    url: '/business/miusic/' + id,
    method: 'delete'
  })
}

// 导出音乐模板
export function exportMiusic(query) {
  return request({
    url: '/business/miusic/export',
    method: 'get',
    params: query
  })
}
