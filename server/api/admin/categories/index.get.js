export default defineEventHandler(async () => {
  return prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { orchids: true } } }
  })
})
