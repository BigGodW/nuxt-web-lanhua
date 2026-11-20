/**
 * 第三方平台（启用中）
 * GET /api/platforms
 */
export default defineEventHandler(() => {
  return loadPlatforms()
})
