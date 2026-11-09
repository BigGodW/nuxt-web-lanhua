import QRCode from 'qrcode'

/**
 * 二维码图片（分享海报用）
 * GET /api/qrcode?text=https://xxx&size=320
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const text = String(query.text || '').slice(0, 512)
  if (!text) throw createError({ statusCode: 400, message: '缺少 text 参数' })

  const size = Math.min(600, Math.max(120, Number(query.size) || 320))
  const buffer = await QRCode.toBuffer(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#24382FFF', light: '#FFFFFFFF' }
  })

  setHeader(event, 'Content-Type', 'image/png')
  setHeader(event, 'Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  return buffer
})
