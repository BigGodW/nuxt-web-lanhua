export default defineEventHandler(async (event) => {
  const id = getId(event)
  const body = await readBody(event)
  const data = articleData(body)

  if (data.slug !== undefined) {
    data.slug = makeSlug(data.slug, 'article')
  }
  if (data.title !== undefined) {
    required(data.title, '文章标题')
  }

  return guard(() => prisma.article.update({ where: { id }, data }))
})
