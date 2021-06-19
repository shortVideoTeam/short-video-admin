import request from '@/utils/request'

// 查询钱包明细列表
export function listWalle(query) {
  return request({
    url: '/business/walle/list',
    method: 'get',
    params: query
  })
}

// 查询钱包明细详细
export function getWalle(id) {
  return request({
    url: '/business/walle/' + id,
    method: 'get'
  })
}

// 新增钱包明细
export function addWalle(data) {
  return request({
    url: '/business/walle',
    method: 'post',
    data: data
  })
}

// 修改钱包明细
export function updateWalle(data) {
  return request({
    url: '/business/walle',
    method: 'put',
    data: data
  })
}

// 删除钱包明细
export function delWalle(id) {
  return request({
    url: '/business/walle/' + id,
    method: 'delete'
  })
}

// 导出钱包明细
export function exportWalle(query) {
  return request({
    url: '/business/walle/export',
    method: 'get',
    params: query
  })
}
