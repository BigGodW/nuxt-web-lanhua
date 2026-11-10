/**
 * 首页聚合接口：一次请求返回首屏所需数据
 *
 * 数据加载与缓存都在 server/utils/queries.js 里（启动预热共用同一份 key），
 * 这里只做路由出口。
 */
export default defineEventHandler(() => loadHome())
