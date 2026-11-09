export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const orchid = await prisma.orchid.findFirst({
    where: { slug, status: 'published' },
    include: { category: { select: { name: true, slug: true, subtitle: true } } }
  })

  if (!orchid) {
    throw createError({ statusCode: 404, message: '该品种不存在或已下架' })
  }

  // 浏览量异步累加，不阻塞响应
  prisma.orchid
    .update({ where: { id: orchid.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {})

  const related = await prisma.orchid.findMany({
    where: { status: 'published', categoryId: orchid.categoryId, id: { not: orchid.id } },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
    take: 4,
    select: { id: true, name: true, slug: true, cover: true, summary: true }
  })

  return { ...orchid, related }
})
