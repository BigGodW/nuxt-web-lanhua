/**
 * 文章列表：?page=1&pageSize=8&category=养护&keyword=浇水
 */
export default defineEventHandler(async (event) => {
  const { query, page, pageSize, skip, take } = getPaging(event, 8)

  const where = { status: 'published' }

  if (query.category) {
    where.category = String(query.category)
  }

  if (query.keyword) {
    const keyword = String(query.keyword).trim()
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { summary: { contains: keyword, mode: 'insensitive' } }
      ]
    }
  }

  return pagedList(prisma.article, {
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      cover: true,
      summary: true,
      category: true,
      author: true,
      tags: true,
      isTop: true,
      viewCount: true,
      publishedAt: true
    },
    orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
    page,
    pageSize,
    skip,
    take
  })
})
