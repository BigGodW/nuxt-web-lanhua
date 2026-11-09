export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const username = String(body?.username || '').trim()
  const password = String(body?.password || '')

  if (!username || !password) {
    throw createError({ statusCode: 400, message: '请输入账号与密码' })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !verifyPassword(password, user.password)) {
    throw createError({ statusCode: 401, message: '账号或密码错误' })
  }

  setAuthCookie(event, user.id)

  return {
    id: user.id,
    username: user.username,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role
  }
})
