/**
 * 全部标签（含兰花 / 文章数量）
 * GET /api/tags
 */
export default defineEventHandler(() => {
  return loadTags()
})
