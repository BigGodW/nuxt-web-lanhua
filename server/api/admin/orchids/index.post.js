export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = orchidData(body)

  required(data.name, '品种名称')
  if (!data.categoryId) {
    throw createError({ statusCode: 400, message: '请选择所属品类' })
  }

  data.slug = makeSlug(data.slug || data.name, 'orchid')

  const orchid = await guard(() =>
    prisma.orchid.create({
      data,
      include: { category: { select: { id: true, name: true } } }
    })
  )

  return orchid
})
