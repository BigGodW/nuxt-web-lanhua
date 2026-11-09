export default defineEventHandler(async () => {
  const [orchidCount, articleCount, categoryCount, bannerCount, draftOrchids, draftArticles, views] =
    await prisma.$transaction([
      prisma.orchid.count(),
      prisma.article.count(),
      prisma.category.count(),
      prisma.banner.count(),
      prisma.orchid.count({ where: { status: 'draft' } }),
      prisma.article.count({ where: { status: 'draft' } }),
      prisma.orchid.aggregate({ _sum: { viewCount: true } })
    ])

  const [recentOrchids, recentArticles] = await prisma.$transaction([
    prisma.orchid.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, status: true, createdAt: true, category: { select: { name: true } } }
    }),
    prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, status: true, category: true, createdAt: true }
    })
  ])

  return {
    counts: {
      orchids: orchidCount,
      articles: articleCount,
      categories: categoryCount,
      banners: bannerCount,
      drafts: draftOrchids + draftArticles,
      views: views._sum.viewCount || 0
    },
    recentOrchids,
    recentArticles
  }
})
