export default defineEventHandler(async (event) => {
  const id = getId(event)
  await guard(() => prisma.orchid.delete({ where: { id } }))
  return { ok: true }
})
