export default defineEventHandler(async (event) => {
  const id = getId(event)
  const body = await readBody(event)
  const data = bannerData(body)

  if (data.title !== undefined) {
    required(data.title, '轮播标题')
  }

  return guard(() => prisma.banner.update({ where: { id }, data }))
})
