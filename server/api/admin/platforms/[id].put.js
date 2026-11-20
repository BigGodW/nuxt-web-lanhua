export default defineEventHandler(async (event) => {
  const id = getId(event)
  const body = await readBody(event)
  const data = platformData(body)

  if (data.name !== undefined) {
    required(data.name, '平台名称')
  }

  return guard(() => prisma.platform.update({ where: { id }, data }))
})
