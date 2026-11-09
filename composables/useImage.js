/**
 * 图片地址工具：七牛 CDN 图片按需裁剪 + 转 webp，减少访问带宽
 * 非 CDN 图片（本地 /images、外链）原样返回
 */
export function useImage() {
  const config = useRuntimeConfig()
  const domain = String(config.public.qiniuCdnDomain || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '')

  function isCdn(src) {
    return Boolean(domain && String(src || '').includes(domain))
  }

  function img(src, width = 0, quality = 82) {
    const value = String(src || '').trim()
    if (!value) return ''
    if (!/^https?:\/\//i.test(value)) return value
    if (/\?(imageView2|imageMogr2)/i.test(value)) return value
    if (!isCdn(value)) return value

    const base = value.split('?')[0]
    const params = ['imageView2/2']
    if (width) params.push(`w/${Math.round(width)}`)
    params.push('format/webp', `q/${quality}`)
    return `${base}?${params.join('/')}`
  }

  return { img, isCdn, domain }
}
