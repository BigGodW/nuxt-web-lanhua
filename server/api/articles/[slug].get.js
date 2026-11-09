export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const article = await prisma.article.findFirst({
    where: { slug, status: 'published' }
  })

  if (!article) {
    throw createError({ statusCode: 404, message: '文章不存在或已下架' })
  }

  prisma.article
    .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {})

  const [prev, next, related] = await prisma.$transaction([
    prisma.article.findFirst({
      where: { status: 'published', publishedAt: { lt: article.publishedAt } },
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true }
    }),
    prisma.article.findFirst({
      where: { status: 'published', publishedAt: { gt: article.publishedAt } },
      orderBy: { publishedAt: 'asc' },
      select: { title: true, slug: true }
    }),
    prisma.article.findMany({
      where: { status: 'published', category: article.category, id: { not: article.id } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, slug: true, cover: true, publishedAt: true }
    })
  ])

  return { ...article, prev, next, related }
})
