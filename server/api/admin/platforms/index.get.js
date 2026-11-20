export default defineEventHandler(() => {
  return prisma.platform.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] })
})
