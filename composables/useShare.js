/**
 * 分享相关的前端能力：链接拼接 / 微信 JS-SDK / 复制 / 海报生成
 * 说明：微信与抖音都没有"网页直接调起分享"的通用能力，
 * 因此这里的策略是：能配 JS-SDK 的走 JS-SDK（分享卡片标题/摘要/缩略图），
 * 其余场景用「复制链接 + 二维码海报」兜底，保证两端都有体面的分享体验。
 */

const WX_SDK = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('微信 JS-SDK 加载失败'))
    document.head.appendChild(script)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片加载失败'))
    image.src = src
  })
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function useShare() {
  const config = useRuntimeConfig()
  const site = useSite()
  const cdnDomain = String(config.public.qiniuCdnDomain || '').replace(/^https?:\/\//, '')

  // 站点地址优先级：后台设置 > 环境变量 > 当前请求域名
  function origin() {
    const fromSetting = String(site.value?.siteUrl || '').replace(/\/+$/, '')
    if (fromSetting) return fromSetting

    const fromEnv = String(config.public.siteUrl || '').replace(/\/+$/, '')
    if (fromEnv) return fromEnv

    if (import.meta.client) return window.location.origin
    try {
      return useRequestURL().origin
    } catch {
      return ''
    }
  }

  function absolute(path = '') {
    if (!path) {
      if (import.meta.client) return window.location.href.split('#')[0]
      return origin()
    }
    if (/^https?:\/\//i.test(path)) return path
    return `${origin()}${path.startsWith('/') ? '' : '/'}${path}`
  }

  /** 分享缩略图：七牛 CDN 转 jpg 并限制宽度（微信/抖音爬虫对 webp 支持一般） */
  function shareImage(src, width = 500) {
    const value = String(src || '').trim()
    if (!value) return ''
    if (!/^https?:\/\//i.test(value)) return absolute(value)
    if (cdnDomain && value.includes(cdnDomain)) {
      return `${value.split('?')[0]}?imageView2/2/w/${width}/format/jpg/q/85`
    }
    return value
  }

  function env() {
    if (!import.meta.client) return { inWeChat: false, inDouyin: false, mobile: false }
    const ua = navigator.userAgent.toLowerCase()
    return {
      inWeChat: /micromessenger/.test(ua),
      inDouyin: /aweme|bytedance|douyin/.test(ua),
      mobile: /android|iphone|ipad|ipod|harmony|mobile/.test(ua)
    }
  }

  async function copyText(text) {
    if (!import.meta.client) return false
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      const input = document.createElement('textarea')
      input.value = text
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(input)
      return ok
    }
  }

  /**
   * 配置微信分享卡片（需要公众号 AppID/Secret）
   * 返回 { enabled, reason }
   */
  async function setupWechat({ title, desc, link, imgUrl }) {
    if (!import.meta.client || !env().inWeChat) return { enabled: false, reason: '不在微信内' }

    let sign
    try {
      sign = await $fetch('/api/wechat/signature', { query: { url: link } })
    } catch (error) {
      return { enabled: false, reason: error?.data?.message || '微信签名失败' }
    }
    if (!sign?.enabled) return { enabled: false, reason: sign?.reason || '未配置公众号' }

    try {
      await loadScript(WX_SDK)
      const wx = window.wx
      if (!wx) return { enabled: false, reason: 'JS-SDK 不可用' }

      wx.config({
        debug: false,
        appId: sign.appId,
        timestamp: sign.timestamp,
        nonceStr: sign.nonceStr,
        signature: sign.signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
      })

      await new Promise((resolve) => {
        wx.ready(resolve)
        wx.error(resolve)
      })

      const payload = { title, desc, link, imgUrl }
      wx.updateAppMessageShareData?.(payload)
      wx.updateTimelineShareData?.({ title: `${title}｜九畹`, link, imgUrl })
      return { enabled: true }
    } catch (error) {
      return { enabled: false, reason: error.message }
    }
  }

  /** 生成竖版分享海报（750×1180），返回 dataURL */
  async function makePoster({ title = '', desc = '', image = '', url = '', tag = '国兰清赏', seal = '兰' }) {
    if (!import.meta.client) return ''

    const W = 750
    const H = 1180
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    const serif = '"Songti SC", "STSong", "SimSun", "Noto Serif SC", serif'
    const sans = '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif'

    // 宣纸底 + 细边框
    ctx.fillStyle = '#F7F3E9'
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#E3DBC9'
    ctx.lineWidth = 2
    ctx.strokeRect(26, 26, W - 52, H - 52)

    // 顶部标题
    ctx.fillStyle = '#8A7A55'
    ctx.font = `500 20px ${serif}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('九 畹 · 国 兰 清 赏', W / 2, 84)

    // 封面
    const box = { x: 52, y: 112, w: 646, h: 506 }
    ctx.save()
    ctx.beginPath()
    ctx.rect(box.x, box.y, box.w, box.h)
    ctx.clip()
    let drawn = false
    if (image) {
      try {
        const proxied = `/api/image-proxy?url=${encodeURIComponent(image)}`
        const img = await loadImage(proxied)
        const scale = Math.max(box.w / img.width, box.h / img.height)
        const dw = img.width * scale
        const dh = img.height * scale
        ctx.drawImage(img, box.x + (box.w - dw) / 2, box.y + (box.h - dh) / 2, dw, dh)
        drawn = true
      } catch {
        drawn = false
      }
    }
    if (!drawn) {
      const gradient = ctx.createLinearGradient(box.x, box.y, box.x + box.w, box.y + box.h)
      gradient.addColorStop(0, '#24382F')
      gradient.addColorStop(1, '#5C7566')
      ctx.fillStyle = gradient
      ctx.fillRect(box.x, box.y, box.w, box.h)
      ctx.fillStyle = 'rgba(247,243,233,0.35)'
      ctx.font = `400 160px ${serif}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('兰', box.x + box.w / 2, box.y + box.h / 2)
    }
    ctx.restore()

    // 品类 / 标签
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#9A8355'
    ctx.font = `500 20px ${sans}`
    ctx.fillText(String(tag).slice(0, 24), 52, 668)

    // 标题（最多两行）
    const titleFont = `700 42px ${serif}`
    ctx.font = titleFont
    ctx.fillStyle = '#24382F'
    const maxWidth = 646
    let line = ''
    const lines = []
    for (const char of String(title)) {
      const test = line + char
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line)
        line = char
        if (lines.length === 2) break
      } else {
        line = test
      }
    }
    if (lines.length < 2 && line) lines.push(line)
    if (lines.length === 2 && String(title).length > lines.join('').length) {
      lines[1] = `${lines[1].slice(0, -1)}…`
    }
    lines.forEach((text, index) => {
      ctx.fillText(text, 52, 722 + index * 58)
    })

    // 摘要（最多三行）
    let y = 722 + lines.length * 58 + 18
    if (desc) {
      ctx.font = `400 23px ${sans}`
      ctx.fillStyle = '#6A6A5E'
      const words = String(desc)
      let current = ''
      let count = 0
      for (const char of words) {
        const test = current + char
        if (ctx.measureText(test).width > maxWidth && current) {
          ctx.fillText(current, 52, y)
          y += 38
          current = char
          count += 1
          if (count === 3) break
        } else {
          current = test
        }
      }
      if (count < 3 && current) {
        ctx.fillText(current, 52, y)
        y += 38
      }
    }

    // 分隔线
    const dividerY = Math.max(y + 18, 930)
    ctx.strokeStyle = '#DCD3BE'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(52, dividerY)
    ctx.lineTo(W - 52, dividerY)
    ctx.stroke()

    // 二维码
    const qrSize = 150
    const qrY = dividerY + 34
    try {
      const qr = await loadImage(`/api/qrcode?text=${encodeURIComponent(url)}&size=360`)
      ctx.drawImage(qr, 52, qrY, qrSize, qrSize)
    } catch {
      ctx.strokeStyle = '#C9BEA4'
      ctx.strokeRect(52, qrY, qrSize, qrSize)
    }

    ctx.fillStyle = '#24382F'
    ctx.font = `600 26px ${serif}`
    ctx.fillText('长按识别 · 阅读全文', 226, qrY + 52)
    ctx.fillStyle = '#8A8A7A'
    ctx.font = `400 18px ${sans}`
    ctx.fillText('国兰品种鉴赏 · 兰文化随笔', 226, qrY + 88)

    // 印章
    const sealSize = 58
    const sealX = W - 52 - sealSize
    const sealY = qrY + qrSize - sealSize
    ctx.fillStyle = '#B23B2E'
    roundRect(ctx, sealX, sealY, sealSize, sealSize, 4)
    ctx.fill()
    ctx.fillStyle = '#F7F3E9'
    ctx.font = `700 30px ${serif}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(seal).slice(0, 1), sealX + sealSize / 2, sealY + sealSize / 2 + 1)

    // 底部
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#A79C86'
    ctx.font = `400 17px ${sans}`
    ctx.fillText(url.replace(/^https?:\/\//, ''), W / 2, H - 44)

    return canvas.toDataURL('image/jpeg', 0.92)
  }

  function download(dataUrl, filename = 'jiuwan-share.jpg') {
    if (!import.meta.client || !dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return { absolute, shareImage, env, copyText, setupWechat, makePoster, download }
}
