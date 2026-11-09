import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'gl_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 天

/* -------------------- 密码 -------------------- */

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':')
  if (!salt || !hash) return false
  const target = Buffer.from(hash, 'hex')
  const input = scryptSync(String(password), salt, 64)
  return target.length === input.length && timingSafeEqual(target, input)
}

/* -------------------- 令牌（HMAC 签名，无额外依赖） -------------------- */

function secret() {
  return useRuntimeConfig().authSecret || 'jiu-wan-dev-secret'
}

export function signToken(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url')
  const sig = createHmac('sha256', secret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyToken(token) {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = createHmac('sha256', secret()).update(body).digest('base64url')
  if (sig.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/* -------------------- 会话 -------------------- */

export function setAuthCookie(event, userId) {
  setCookie(event, COOKIE_NAME, signToken({ uid: userId }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production'
  })
}

export function clearAuthCookie(event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

/** 读取当前登录用户（未登录返回 null，不抛错） */
export async function getAuthUser(event) {
  const token = getCookie(event, COOKIE_NAME)
  const payload = verifyToken(token)
  if (!payload?.uid) return null
  return prisma.user.findUnique({
    where: { id: Number(payload.uid) },
    select: { id: true, username: true, nickname: true, avatar: true, role: true }
  })
}

/** 受保护接口统一守卫：/api/admin/** 已在中间件中调用 */
export async function requireAdmin(event) {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: '登录已失效，请重新登录' })
  }
  event.context.user = user
  return user
}
