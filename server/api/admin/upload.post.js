import { randomBytes } from 'node:crypto'
import { compressImage, isAllowedImage } from '../../utils/image'
import { uploadBuffer, cdnUrl } from '../../utils/qiniu'

/**
 * 后台图片上传
 * POST /api/admin/upload?type=orchid&name=songmei
 * ① JSON: { base64: "data:image/jpeg;base64,...", name, type }（EdgeOne 环境推荐）
 * ② form-data: file=@xxx.jpg（本地兼容）
 * 返回 { url, key, width, height, size }
 *
 * 服务端统一压缩（默认最长边 1600，JPEG q82），再传七牛，访问走 CDN。
 */

const MAX_BYTES = 12 * 1024 * 1024

const MAX_WIDTH = {
  banner: 1920,
  orchid: 1600,
  article: 1600,
  category: 1200,
  platform: 800,
  share: 1200
}

export default defineEventHandler(async (event) => {
  const contentType = String(getHeader(event, 'content-type') || '')
  const query = getQuery(event)

  let fileData
  let mime
  let name = ''
  let requestedType = query.type

  if (contentType.includes('application/json')) {
    // 浏览器端压缩后以 base64 提交（EdgeOne Cloud Functions 对 multipart 二进制解析不可靠）
    const body = (await readBody(event)) || {}
    const value = String(body.base64 || '')
    const matched = /^data:(image\/[a-z0-9.+-]+);base64,/i.exec(value)
    mime = matched ? matched[1] : 'image/jpeg'
    fileData = Buffer.from(matched ? value.slice(matched[0].length) : value, 'base64')
    name = String(body.name || query.name || '')
    requestedType = body.type || requestedType
  } else {
    // 兼容原有 multipart 上传
    const parts = await readMultipartFormData(event)
    const file = (parts || []).find((part) => part.name === 'file' && part.data?.length)
    fileData = file?.data
    mime = file?.type
    name = String(file?.filename || query.name || '')
  }

  if (!fileData?.length) {
    throw createError({ statusCode: 400, message: '请选择要上传的图片' })
  }
  if (fileData.length > MAX_BYTES) {
    throw createError({ statusCode: 413, message: '图片不能超过 12MB' })
  }
  if (!isAllowedImage(mime)) {
    throw createError({ statusCode: 415, message: '仅支持 JPG / PNG / WebP / GIF 图片' })
  }

  const type = String(requestedType || 'misc')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 16) || 'misc'
  const maxWidth = MAX_WIDTH[type] || 1600

  let compressed
  try {
    compressed = await compressImage(fileData, { maxWidth, quality: 82 })
  } catch (error) {
    throw createError({ statusCode: 400, message: `图片解析失败：${error.message}` })
  }

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = randomBytes(4).toString('hex')

  const slug = String(name)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40)

  const key = `uploads/${type}/${yyyy}${mm}/${yyyy}${mm}${dd}-${slug ? `${slug}-` : ''}${rand}.jpg`

  await uploadBuffer(compressed.buffer, key, 'image/jpeg')

  return {
    url: cdnUrl(key),
    key,
    width: compressed.width,
    height: compressed.height,
    size: compressed.size
  }
})
