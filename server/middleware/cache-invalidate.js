/**
 * 后台写入后清空前台只读缓存
 *
 * 前台接口现在带 60s~5min 的内存缓存，后台一改内容必须让缓存立刻失效，
 * 否则会出现「后台已发布、前台还看不到」的错觉。
 * 这里是全局 middleware，只对 /api/admin 下的非 GET 请求挂钩，
 * 并且只在响应成功（<400）时清除。
 */
export default defineEventHandler((event) => {
  const method = event.node.req.method || 'GET'
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return

  const url = event.node.req.url || ''
  if (!url.startsWith('/api/admin')) return

  event.node.res.on('finish', () => {
    if (event.node.res.statusCode < 400) {
      const cleared = invalidateCache()
      if (cleared > 0 && process.env.NODE_ENV === 'development') {
        console.log(`[cache] 后台写入成功，已清除 ${cleared} 条前台缓存`)
      }
    }
  })
})
