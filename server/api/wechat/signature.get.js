import { createHash } from 'node:crypto'

/**
 * 微信公众号 JS-SDK 签名
 * GET /api/wechat/signature?url=https://站点/当前页
 * 返回 { enabled, appId, timestamp, nonceStr, signature }
 *
 * 需要在后台「站点设置 → 分享与开放」里填写公众号 AppID / AppSecret，
 * 并把站点域名加入公众号的「JS 接口安全域名」。
 * 未配置时返回 enabled:false，前端自动降级为「右上角分享」引导。
 */

let tokenCache = { value: '', expiresAt: 0 }
let ticketCache = { value: '', expiresAt: 0 }

async function readSetting(key) {
  const row = await prisma.setting.findUnique({ where: { key } })
  return row?.value || ''
}

async function getAccessToken(appId, appSecret) {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value

  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
  const data = await $fetch(url).catch(() => ({}))
  if (!data.access_token) {
    throw createError({ statusCode: 502, message: `获取微信 access_token 失败：${data.errmsg || '请检查 AppID / AppSecret'}` })
  }
  tokenCache = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 }
  return tokenCache.value
}

async function getJsapiTicket(accessToken) {
  if (ticketCache.value && Date.now() < ticketCache.expiresAt) return ticketCache.value

  const data = await $fetch(
    `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
  ).catch(() => ({}))
  if (!data.ticket) {
    throw createError({ statusCode: 502, message: `获取 jsapi_ticket 失败：${data.errmsg || '未知原因'}` })
  }
  ticketCache = { value: data.ticket, expiresAt: Date.now() + (data.expires_in - 300) * 1000 }
  return ticketCache.value
}

export default defineEventHandler(async (event) => {
  const [appId, appSecret] = await Promise.all([readSetting('wechatAppId'), readSetting('wechatAppSecret')])
  if (!appId || !appSecret) {
    return { enabled: false, reason: '后台未配置公众号 AppID / AppSecret' }
  }

  const pageUrl = String(getQuery(event).url || '').split('#')[0]
  if (!pageUrl) throw createError({ statusCode: 400, message: '缺少 url 参数' })

  const accessToken = await getAccessToken(appId, appSecret)
  const ticket = await getJsapiTicket(accessToken)

  const nonceStr = Math.random().toString(36).slice(2, 18)
  const timestamp = Math.floor(Date.now() / 1000)
  const raw = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${pageUrl}`
  const signature = createHash('sha1').update(raw).digest('hex')

  return { enabled: true, appId, timestamp, nonceStr, signature }
})
