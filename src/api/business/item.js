import request from '@/utils/request'

// 查询订单记录项列表
export function listItem(query) {
  return request({
    url: '/business/item/list',
    method: 'get',
    params: query
  })
}

// 查询订单记录项详细
export function getItem(id) {
  return request({
    url: '/business/item/' + id,
    method: 'get'
  })
}

// 新增订单记录项
export function addItem(data) {
  return request({
    url: '/business/item',
    method: 'post',
    data: data
  })
}

// 修改订单记录项
export function updateItem(data) {
  return request({
    url: '/business/item',
    method: 'put',
    data: data
  })
}

// 删除订单记录项
export function delItem(id) {
  return request({
    url: '/business/item/' + id,
    method: 'delete'
  })
}

// 导出订单记录项
export function exportItem(query) {
  return request({
    url: '/business/item/export',
    method: 'get',
    params: query
  })
}
