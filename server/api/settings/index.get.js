/**
 * 站点配置：键值对转对象，前台/后台共用
 */
export default defineEventHandler(() => {
  // 站点配置几乎不变：缓存 5 分钟，后台保存设置时会主动清空
  // 注意 app.vue 里对它有顶层 await，这是首屏链路上最值得缓存的一环
  return loadSettings()
})
