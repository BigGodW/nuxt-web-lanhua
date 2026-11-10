export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  // 详情页缓存 2 分钟：正文+关联品种一次性算好，命中时 0 次往返
  const data = await cached(`orchid:${slug}`, 2 * 60 * 1000, async () => {
    const orchid = await prisma.orchid.findFirst({
      where: { slug, status: 'published' },
      include: { category: { select: { name: true, slug: true, subtitle: true } } }
    })

    if (!orchid) {
      throw createError({ statusCode: 404, message: '该品种不存在或已下架' })
    }

    const related = await prisma.orchid.findMany({
      where: { status: 'published', categoryId: orchid.categoryId, id: { not: orchid.id } },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      take: 4,
      select: { id: true, name: true, slug: true, cover: true, summary: true }
    })

    return { ...orchid, related }
  })

  // 浏览量：同一条内容 60s 内只累加一次，不阻塞响应，也不为每个请求占一条连接
  if (onceIn(`view:orchid:${data.id}`, 60 * 1000)) {
    prisma.orchid
      .update({ where: { id: data.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {})
  }

  return data
})
