/**
 * 后台路由守卫：/admin/** 需要登录（/admin/login 除外）
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

  const { user, fetchMe } = useAdmin()
  if (!user.value) await fetchMe()

  if (!user.value) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
