import { createHmac } from 'node:crypto'

/**
 * 七牛云上传：只依赖 fetch + node:crypto，不引入 SDK
 * 说明：上传后统一通过 CDN 域名访问，并可按需拼接图片处理参数
 */

const UPLOAD_HOSTS = {
  z0: 'https://upload.qiniup.com',
  z1: 'https://upload-z1.qiniup.com',
  z2: 'https://upload-z2.qiniup.com',
  na0: 'https://upload-na0.qiniup.com',
  as0: 'https://upload-as0.qiniup.com'
}

function urlSafeBase64(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

function signUrlSafe(data, secretKey) {
  return createHmac('sha1', secretKey).update(data).digest('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

function qiniuConfig() {
  const config = useRuntimeConfig()
  const accessKey = config.qiniuAccessKey
  const secretKey = config.qiniuSecretKey
  const bucket = config.qiniuBucket
  const domain = String(config.qiniuCdnDomain || config.public?.qiniuCdnDomain || '').replace(/^https?:\/\//, '').replace(/\/+$/, '')

  if (!accessKey || !secretKey || !bucket || !domain) {
    throw createError({ statusCode: 500, message: '七牛云未配置：请检查 .env 中的 NUXT_QINIU_* 变量' })
  }

  return { accessKey, secretKey, bucket, domain, region: config.qiniuRegion || 'z0' }
}

/** 生成上传凭证（带 scope 与有效期，不依赖服务端 SDK） */
export function createUploadToken({ key, expires = 600 }) {
  const { accessKey, secretKey, bucket } = qiniuConfig()
  const policy = {
    scope: `${bucket}:${key}`,
    deadline: Math.floor(Date.now() / 1000) + expires,
    insertOnly: 1
  }
  const encodedPolicy = urlSafeBase64(JSON.stringify(policy))
  return `${accessKey}:${signUrlSafe(encodedPolicy, secretKey)}:${encodedPolicy}`
}

/** 上传 Buffer 到七牛，返回资源 key */
export async function uploadBuffer(buffer, key, mime = 'image/jpeg') {
  const { region } = qiniuConfig()
  const host = UPLOAD_HOSTS[region] || UPLOAD_HOSTS.z0
  const token = createUploadToken({ key })

  const form = new FormData()
  form.append('token', token)
  form.append('key', key)
  form.append('file', new Blob([buffer], { type: mime }), 'file')

  let response
  try {
    response = await fetch(host, { method: 'POST', body: form })
  } catch (error) {
    throw createError({ statusCode: 502, message: `七牛云连接失败：${error.message}` })
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw createError({ statusCode: 502, message: `七牛云上传失败：${result.error || response.status}` })
  }

  return { key: result.key || key, hash: result.hash || '' }
}

/** key -> CDN 地址 */
export function cdnUrl(key) {
  const { domain } = qiniuConfig()
  return `https://${domain}/${String(key).replace(/^\/+/, '')}`
}

/**
 * 生成图片访问地址（按宽度裁剪 + webp，显著降低带宽）
 * 仅对七牛 CDN 图片生效，本地 /images 静态图原样返回
 */
export function imageUrl(src, { width = 0, quality = 82, format = 'webp' } = {}) {
  const value = String(src || '').trim()
  if (!value) return ''
  if (!/^https?:\/\//i.test(value)) return value
  if (/\?(imageView2|imageMogr2)/i.test(value)) return value

  const { domain } = qiniuConfig()
  if (!domain || !value.includes(domain)) return value

  const base = value.split('?')[0]
  const parts = ['imageView2/2']
  if (width) parts.push(`w/${Math.round(width)}`)
  if (format) parts.push(`format/${format}`)
  if (quality) parts.push(`q/${quality}`)
  return `${base}?${parts.join('/')}`
}
