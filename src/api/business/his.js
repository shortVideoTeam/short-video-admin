import request from '@/utils/request'

// 查询搜索历史记录列表
export function listHis(query) {
  return request({
    url: '/business/his/list',
    method: 'get',
    params: query
  })
}

// 查询搜索历史记录详细
export function getHis(id) {
  return request({
    url: '/business/his/' + id,
    method: 'get'
  })
}

// 新增搜索历史记录
export function addHis(data) {
  return request({
    url: '/business/his',
    method: 'post',
    data: data
  })
}

// 修改搜索历史记录
export function updateHis(data) {
  return request({
    url: '/business/his',
    method: 'put',
    data: data
  })
}

// 删除搜索历史记录
export function delHis(id) {
  return request({
    url: '/business/his/' + id,
    method: 'delete'
  })
}

// 导出搜索历史记录
export function exportHis(query) {
  return request({
    url: '/business/his/export',
    method: 'get',
    params: query
  })
}
