export default defineEventHandler(async (event) => {
  const id = getId(event)

  const count = await prisma.orchid.count({ where: { categoryId: id } })
  if (count > 0) {
    throw createError({
      statusCode: 400,
      message: `该品类下还有 ${count} 个品种，请先移出或删除后再删除品类`
    })
  }

  await guard(() => prisma.category.delete({ where: { id } }))
  return { ok: true }
})
