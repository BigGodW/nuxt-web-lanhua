/**
 * 批量保存站点配置：请求体即 { key: value } 对象
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw createError({ statusCode: 400, message: '配置格式不正确' })
  }

  const entries = Object.entries(body)
    .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
    .slice(0, 80)
    .map(([key, value]) => [String(key).slice(0, 60), String(value).slice(0, 5000)])

  if (!entries.length) {
    throw createError({ statusCode: 400, message: '没有需要保存的配置项' })
  }

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value }
      })
    )
  )

  return { ok: true, saved: entries.length }
})
