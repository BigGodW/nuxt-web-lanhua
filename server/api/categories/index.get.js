export default defineEventHandler(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { orchids: { where: { status: 'published' } } } } }
  })
})
