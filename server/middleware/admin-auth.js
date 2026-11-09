/**
 * 后台接口统一鉴权：所有 /api/admin/** 请求必须携带有效登录 Cookie
 */
export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  if (!pathname.startsWith('/api/admin')) return
  await requireAdmin(event)
})
