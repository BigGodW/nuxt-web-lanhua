export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  // 详情页缓存 2 分钟：正文+前后篇+相关文章一次算好
  const data = await cached(`article:${slug}`, 2 * 60 * 1000, async () => {
    const article = await prisma.article.findFirst({
      where: { slug, status: 'published' }
    })

    if (!article) {
      throw createError({ statusCode: 404, message: '文章不存在或已下架' })
    }

    // 三处关联查询互不依赖，并发发出去（原来用 $transaction 是串行往返）
    const [prev, next, related] = await Promise.all([
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

  // 浏览量节流：同一篇文章 60s 内只累加一次
  if (onceIn(`view:article:${data.id}`, 60 * 1000)) {
    prisma.article
      .update({ where: { id: data.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {})
  }

  return data
})
