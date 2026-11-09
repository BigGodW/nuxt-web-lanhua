export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const category = await prisma.category.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: { select: { orchids: { where: { status: 'published' } } } },
      orchids: {
        where: { status: 'published' },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          alias: true,
          slug: true,
          cover: true,
          summary: true,
          flowering: true,
          fragrance: true,
          tags: true
        }
      }
    }
  })

  if (!category) {
    throw createError({ statusCode: 404, message: '该品类不存在' })
  }

  return category
})
