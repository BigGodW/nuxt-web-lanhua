export default defineEventHandler(async (event) => {
  const id = getId(event)
  await guard(() => prisma.article.delete({ where: { id } }))
  return { ok: true }
})
