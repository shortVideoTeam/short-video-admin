import request from '@/utils/request'

// 查询关键词列表
export function listKeywords(query) {
  return request({
    url: '/business/keywords/list',
    method: 'get',
    params: query
  })
}

// 查询关键词详细
export function getKeywords(keywordId) {
  return request({
    url: '/business/keywords/' + keywordId,
    method: 'get'
  })
}

// 新增关键词
export function addKeywords(data) {
  return request({
    url: '/business/keywords',
    method: 'post',
    data: data
  })
}

// 修改关键词
export function updateKeywords(data) {
  return request({
    url: '/business/keywords',
    method: 'put',
    data: data
  })
}

// 删除关键词
export function delKeywords(keywordId) {
  return request({
    url: '/business/keywords/' + keywordId,
    method: 'delete'
  })
}

// 导出关键词
export function exportKeywords(query) {
  return request({
    url: '/business/keywords/export',
    method: 'get',
    params: query
  })
}
