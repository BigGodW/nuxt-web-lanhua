import sharp from 'sharp'

const PAPER = { r: 247, g: 243, b: 233 }

/**
 * 图片压缩：等比缩放到 maxWidth 以内，转 JPEG（mozjpeg 渐进式）
 * - 自动按 EXIF 摆正方向
 * - 透明底（png/webp）压到宣纸色，避免出现黑边
 * - 去掉 EXIF 等元数据，进一步减小体积
 */
export async function compressImage(buffer, { maxWidth = 1600, quality = 82 } = {}) {
  const input = sharp(buffer, { failOn: 'none', limitInputPixels: 268402689 }).rotate()
  const meta = await input.metadata()

  const hasAlpha = Boolean(meta.hasAlpha)
  const width = Math.min(maxWidth, meta.width || maxWidth)

  let pipeline = input.resize({
    width,
    height: maxWidth,
    fit: 'inside',
    withoutEnlargement: true
  })

  if (hasAlpha) pipeline = pipeline.flatten({ background: PAPER })

  const { data, info } = await pipeline
    .jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' })
    .toBuffer({ resolveWithObject: true })

  return { buffer: data, width: info.width, height: info.height, size: info.size }
}

/** 是否为本服务允许接收的图片类型 */
export function isAllowedImage(mime = '') {
  return /^image\/(jpeg|jpg|png|webp|gif|bmp|avif)$/i.test(String(mime).split(';')[0].trim())
}
