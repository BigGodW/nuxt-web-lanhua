/**
 * 品种列表：?page=1&pageSize=12&category=chunlan&keyword=梅&featured=1
 *
 * 查询与缓存都在 server/utils/queries.js（预热共用同一套 key），这里只做参数解析。
 */
export default defineEventHandler((event) => {
  const { query, page, pageSize } = getPaging(event, 12)

  return loadOrchidList({
    page,
    pageSize,
    category: query.category ? String(query.category) : '',
    keyword: query.keyword ? String(query.keyword) : '',
    featured: query.featured ? String(query.featured) : ''
  })
})
