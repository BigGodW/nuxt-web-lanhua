/**
 * 首页聚合接口：一次请求返回首屏所需数据
 */
export default defineEventHandler(async () => {
  const [banners, categories, featured, articles, orchidCount, articleCount] = await prisma.$transaction([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { orchids: { where: { status: 'published' } } } } }
    }),
    prisma.orchid.findMany({
      where: { status: 'published', isFeatured: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
      include: { category: { select: { name: true, slug: true } } }
    }),
    prisma.article.findMany({
      where: { status: 'published' },
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        cover: true,
        summary: true,
        category: true,
        author: true,
        publishedAt: true,
        viewCount: true
      }
    }),
    prisma.orchid.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'published' } })
  ])

  return {
    banners,
    categories,
    featured,
    articles,
    stats: { orchids: orchidCount, articles: articleCount, categories: categories.length }
  }
})
