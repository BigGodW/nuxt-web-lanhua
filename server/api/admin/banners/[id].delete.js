export default defineEventHandler(async (event) => {
  const id = getId(event)
  await guard(() => prisma.banner.delete({ where: { id } }))
  return { ok: true }
})
