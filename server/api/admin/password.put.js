/**
 * 修改当前登录账号密码
 */
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)
  const oldPassword = String(body?.oldPassword || '')
  const newPassword = String(body?.newPassword || '')

  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: '新密码至少 6 位' })
  }

  const record = await prisma.user.findUnique({ where: { id: user.id } })
  if (!record || !verifyPassword(oldPassword, record.password)) {
    throw createError({ statusCode: 400, message: '原密码不正确' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashPassword(newPassword) }
  })

  return { ok: true }
})
