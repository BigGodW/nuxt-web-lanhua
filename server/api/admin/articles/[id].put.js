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
  if (body.tags !== undefined) data.tags = tagOps(body.tags)

  return guard(() =>
    prisma.article.update({
      where: { id },
      data,
      include: { tags: { select: { name: true, slug: true } } }
    })
  )
})
