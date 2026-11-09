export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = bannerData(body)

  required(data.title, '轮播标题')

  return guard(() => prisma.banner.create({ data }))
})
