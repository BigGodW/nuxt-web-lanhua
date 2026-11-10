/**
 * 启动预热：服务一起来就把首屏要用的数据灌进缓存
 *
 * 为什么需要：数据库在海外，冷启动第一波请求要建连接 + 多表查询，实测 7~9 秒。
 * 预热把这份成本挪到「服务启动后、无访客时」，第一个访客直接命中缓存。
 *
 * 关键细节：
 * - 先用 SELECT 1 建好连接，否则第一个预热任务有较高概率因冷连接失败；
 * - 每个任务失败后重试，海外库抖动时首发必挂；
 * - 串行执行，避免启动瞬间同时建立多条跨洋连接把池打满；
 * - 参数要和前端首屏请求一致（pageSize 不同就是另一个缓存 key，预热等于白做）；
 * - 失败静默，不影响服务可用性（首个请求会自行回源）；
 * - 需要关闭时设环境变量 NUXT_DISABLE_WARMUP=1。
 */
import { prisma } from '../utils/prisma.js'
import {
  loadSettings,
  loadCategories,
  loadOrchidList,
  loadArticleList,
  loadHome
} from '../utils/queries.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runWithRetry(task, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await task()
      return true
    } catch {
      if (attempt < retries) await sleep(1500)
    }
  }
  return false
}

export default defineNitroPlugin(() => {
  if (process.env.NUXT_DISABLE_WARMUP === '1') return

  const tasks = [
    // 先把连接建起来，后面每个任务都能复用
    () => prisma.$queryRaw`SELECT 1`,
    loadSettings,
    loadCategories,
    loadHome,
    () => loadOrchidList({ page: 1, pageSize: 12 }),
    () => loadArticleList({ page: 1, pageSize: 9 })
  ]

  setTimeout(async () => {
    // 串行太慢（每个任务要跨洋往返，6 个跑完要几十秒），
    // 分两批、每批 3 个并发：既能让缓存尽快就绪，又不至于一次建 6 条连接。
    for (let i = 0; i < tasks.length; i += 3) {
      await Promise.allSettled(tasks.slice(i, i + 3).map((task) => runWithRetry(task)))
    }
  }, 800)
})
