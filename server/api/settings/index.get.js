/**
 * 站点配置：键值对转对象，前台/后台共用
 */
export default defineEventHandler(async () => {
  const rows = await prisma.setting.findMany()
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})
})
