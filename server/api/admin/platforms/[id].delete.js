export default defineEventHandler(async (event) => {
  const id = getId(event)
  await guard(() => prisma.platform.delete({ where: { id } }))
  return { ok: true }
})
