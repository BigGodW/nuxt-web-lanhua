/**
 * 后台品种列表（含草稿）
 */
export default defineEventHandler(async (event) => {
  const { query, page, pageSize, skip, take } = getPaging(event, 10)

  const where = {}

  if (query.keyword) {
    const keyword = String(query.keyword).trim()
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { alias: { contains: keyword, mode: 'insensitive' } }
      ]
    }
  }

  if (query.categoryId) {
    where.categoryId = toInt(query.categoryId)
  }

  if (query.status) {
    where.status = String(query.status)
  }

  return pagedList(prisma.orchid, {
    where,
    include: { category: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    page,
    pageSize,
    skip,
    take
  })
})
