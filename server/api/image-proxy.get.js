/**
 * 图片代理：仅放行本站图片与七牛 CDN 图片
 * 用途：前端 canvas 生成分享海报时同源取图，避免跨域污染画布
 * GET /api/image-proxy?url=https://cdn.xxx/a.jpg
 */
export default defineEventHandler(async (event) => {
  const raw = String(getQuery(event).url || '')
  if (!raw) throw createError({ statusCode: 400, message: '缺少 url 参数' })

  const config = useRuntimeConfig()
  const cdnHost = String(config.public.qiniuCdnDomain || config.qiniuCdnDomain || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')
  const siteHost = String(config.public.siteUrl || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')

  let target
  try {
    target = new URL(raw, `http://${siteHost || 'localhost'}`)
  } catch {
    throw createError({ statusCode: 400, message: '无效的图片地址' })
  }

  const allowed = [cdnHost, siteHost, 'localhost', '127.0.0.1'].filter(Boolean)
  if (!allowed.includes(target.hostname)) {
    throw createError({ statusCode: 403, message: '该图片地址不被允许' })
  }
  if (!/^https?:$/.test(target.protocol)) {
    throw createError({ statusCode: 400, message: '无效的图片地址' })
  }

  const response = await fetch(target.href, { signal: AbortSignal.timeout(8000) }).catch(() => null)
  if (!response || !response.ok) {
    throw createError({ statusCode: 502, message: '图片获取失败' })
  }

  const type = response.headers.get('content-type') || 'image/jpeg'
  if (!type.startsWith('image/')) {
    throw createError({ statusCode: 415, message: '仅支持图片资源' })
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  if (buffer.length > 8 * 1024 * 1024) {
    throw createError({ statusCode: 413, message: '图片过大' })
  }

  setHeader(event, 'Content-Type', type)
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  return buffer
})
