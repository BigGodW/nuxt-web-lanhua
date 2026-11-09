export default defineEventHandler(async (event) => {
  const id = getId(event)
  const body = await readBody(event)
  const data = categoryData(body)

  if (data.slug !== undefined) {
    data.slug = makeSlug(data.slug, 'category')
  }
  if (data.name !== undefined) {
    required(data.name, '品类名称')
  }

  return guard(() => prisma.category.update({ where: { id }, data }))
})
