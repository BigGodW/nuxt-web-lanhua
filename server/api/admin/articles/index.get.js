export default defineEventHandler(async (event) => {
  const { query, page, pageSize, skip, take } = getPaging(event, 10)

  const where = {}

  if (query.keyword) {
    const keyword = String(query.keyword).trim()
    if (keyword) {
      where.title = { contains: keyword, mode: 'insensitive' }
    }
  }

  if (query.category) where.category = String(query.category)
  if (query.status) where.status = String(query.status)

  return pagedList(prisma.article, {
    where,
    orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
    page,
    pageSize,
    skip,
    take
  })
})
