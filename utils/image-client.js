/**
 * 浏览器端图片压缩：上传前转成 JPEG data URL
 * 目的：① 绕开 EdgeOne Cloud Functions 对 multipart 二进制解析不可靠的问题（改走 JSON/base64）
 *      ② 把请求体压到 6MB（EdgeOne Cloud Functions 上限）以内
 * 服务端仍会再做一次 sharp 压缩，这里主要控制传输体积。
 */
export async function compressImageForUpload(file, maxWidth = 1600, quality = 0.82) {
  if (!file || typeof window === 'undefined') throw new Error('当前环境无法处理图片')

  let source
  let release = () => {}
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' })
    release = () => source.close?.()
  } catch {
    // Safari / 老浏览器回退：用 Image 加载本地 URL（现代浏览器会自动按 EXIF 方向显示）
    const url = URL.createObjectURL(file)
    release = () => URL.revokeObjectURL(url)
    source = await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('图片读取失败，请换一张试试'))
      image.src = url
    })
  }

  try {
    const width = source.width || source.naturalWidth
    const height = source.height || source.naturalHeight
    if (!width || !height) throw new Error('无法读取图片尺寸')

    const scale = Math.min(1, maxWidth / Math.max(width, height))
    const targetWidth = Math.max(1, Math.round(width * scale))
    const targetHeight = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('浏览器不支持图片处理')
    context.fillStyle = '#f7f3e9' // 透明底铺宣纸色，与服务端 flatten 一致
    context.fillRect(0, 0, targetWidth, targetHeight)
    context.drawImage(source, 0, 0, targetWidth, targetHeight)

    return {
      dataUrl: canvas.toDataURL('image/jpeg', quality),
      width: targetWidth,
      height: targetHeight
    }
  } finally {
    release()
  }
}
