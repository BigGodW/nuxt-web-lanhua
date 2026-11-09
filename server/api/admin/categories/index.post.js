export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = categoryData(body)

  required(data.name, '品类名称')
  data.slug = makeSlug(data.slug || data.name, 'category')

  return guard(() => prisma.category.create({ data }))
})
