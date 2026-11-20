export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = platformData(body)

  required(data.name, '平台名称')

  return guard(() => prisma.platform.create({ data }))
})
