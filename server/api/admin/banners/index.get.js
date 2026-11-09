export default defineEventHandler(() => {
  return prisma.banner.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] })
})
