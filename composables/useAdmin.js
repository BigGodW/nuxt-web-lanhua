/**
 * 后台登录态：登录、登出、获取当前用户
 */
export function useAdmin() {
  const user = useState('admin-user', () => null)
  const request = useRequestFetch()

  async function fetchMe() {
    try {
      const data = await request('/api/auth/me')
      user.value = data?.user || null
    } catch {
      user.value = null
    }
    return user.value
  }

  async function login(payload) {
    const data = await $fetch('/api/auth/login', { method: 'POST', body: payload })
    user.value = data
    return data
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      await navigateTo('/admin/login')
    }
  }

  return { user, fetchMe, login, logout }
}
