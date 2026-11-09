import { randomBytes } from 'node:crypto'
import { compressImage, isAllowedImage } from '../../utils/image'
import { uploadBuffer, cdnUrl } from '../../utils/qiniu'

/**
 * 后台图片上传
 * POST /api/admin/upload?type=orchid&name=songmei
 * form-data: file=@xxx.jpg
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
  share: 1200
}

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const file = (parts || []).find((part) => part.name === 'file' && part.data?.length)

  if (!file) {
    throw createError({ statusCode: 400, message: '请选择要上传的图片' })
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, message: '图片不能超过 12MB' })
  }
  if (!isAllowedImage(file.type)) {
    throw createError({ statusCode: 415, message: '仅支持 JPG / PNG / WebP / GIF 图片' })
  }

  const query = getQuery(event)
  const type = String(query.type || 'misc')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 16) || 'misc'
  const maxWidth = MAX_WIDTH[type] || 1600

  let compressed
  try {
    compressed = await compressImage(file.data, { maxWidth, quality: 82 })
  } catch (error) {
    throw createError({ statusCode: 400, message: `图片解析失败：${error.message}` })
  }

  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = randomBytes(4).toString('hex')

  const slug = String(query.name || '')
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
