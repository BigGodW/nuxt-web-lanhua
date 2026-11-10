export default defineEventHandler(() => {
  // 品类清单变动极少，缓存 2 分钟
  return loadCategories()
})
