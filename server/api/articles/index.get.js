/**
 * 文章列表：?page=1&pageSize=8&category=养护&keyword=浇水
 *
 * 查询与缓存都在 server/utils/queries.js（预热共用同一套 key），这里只做参数解析。
 */
export default defineEventHandler((event) => {
  const { query, page, pageSize } = getPaging(event, 8)

  return loadArticleList({
    page,
    pageSize,
    category: query.category ? String(query.category) : '',
    keyword: query.keyword ? String(query.keyword) : ''
  })
})
