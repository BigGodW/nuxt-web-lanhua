export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = articleData(body)

  required(data.title, '文章标题')
  data.slug = makeSlug(data.slug || data.title, 'article')

  return guard(() => prisma.article.create({ data }))
})
