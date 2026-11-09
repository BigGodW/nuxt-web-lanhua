export default defineEventHandler(async (event) => {
  const id = getId(event)
  const body = await readBody(event)
  const data = orchidData(body)

  if (data.slug !== undefined) {
    data.slug = makeSlug(data.slug, 'orchid')
  }
  if (data.name !== undefined) {
    required(data.name, '品种名称')
  }

  return guard(() =>
    prisma.orchid.update({
      where: { id },
      data,
      include: { category: { select: { id: true, name: true } } }
    })
  )
})
