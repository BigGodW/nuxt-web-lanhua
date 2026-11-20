export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = articleData(body)

  required(data.title, '文章标题')
  data.slug = makeSlug(data.slug || data.title, 'article')
  if (body.tags !== undefined) data.tags = tagOps(body.tags)

  return guard(() =>
    prisma.article.create({
      data,
      include: { tags: { select: { name: true, slug: true } } }
    })
  )
})
