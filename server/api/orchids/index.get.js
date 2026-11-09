/**
 * 品种列表：?page=1&pageSize=12&category=chunlan&keyword=梅&featured=1
 */
export default defineEventHandler(async (event) => {
  const { query, page, pageSize, skip, take } = getPaging(event, 12)

  const where = { status: 'published' }

  if (query.category) {
    where.category = { slug: String(query.category) }
  }

  if (query.featured === '1') {
    where.isFeatured = true
  }

  if (query.keyword) {
    const keyword = String(query.keyword).trim()
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { alias: { contains: keyword, mode: 'insensitive' } },
        { summary: { contains: keyword, mode: 'insensitive' } },
        { tags: { has: keyword } }
      ]
    }
  }

  return pagedList(prisma.orchid, {
    where,
    select: {
      id: true,
      name: true,
      alias: true,
      slug: true,
      cover: true,
      summary: true,
      flowering: true,
      fragrance: true,
      difficulty: true,
      tags: true,
      isFeatured: true,
      category: { select: { name: true, slug: true } }
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    page,
    pageSize,
    skip,
    take
  })
})
