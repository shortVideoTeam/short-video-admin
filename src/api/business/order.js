import request from '@/utils/request'

// 查询订单记录列表
export function listOrder(query) {
  return request({
    url: '/business/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单记录详细
export function getOrder(id) {
  return request({
    url: '/business/order/' + id,
    method: 'get'
  })
}

// 新增订单记录
export function addOrder(data) {
  return request({
    url: '/business/order',
    method: 'post',
    data: data
  })
}

// 修改订单记录
export function updateOrder(data) {
  return request({
    url: '/business/order',
    method: 'put',
    data: data
  })
}

// 删除订单记录
export function delOrder(id) {
  return request({
    url: '/business/order/' + id,
    method: 'delete'
  })
}

// 导出订单记录
export function exportOrder(query) {
  return request({
    url: '/business/order/export',
    method: 'get',
    params: query
  })
}
