/**
 * 只读接口的内存缓存（TTL + stale-while-revalidate + 单飞）
 *
 * 为什么需要：数据库在 db.prisma.io（海外），实测单次查询往返 400ms 以上，
 * 首页需要 6 条查询，串行时首屏 2.4s 起步。内容站读多写少，
 * 缓存命中后响应从「N 次跨洋往返」变成 0 次往返。
 *
 * 三个特性：
 * 1. TTL      —— 到期即视为陈旧，不再直接返回。
 * 2. SWR      —— 陈旧时不阻塞请求，立即返回旧值，后台静默刷新一次。
 * 3. 单飞     —— 同一 key 并发请求只打一次库，避免冷启动时把连接池打满。
 */

const store = new Map() // key -> { value, expire, at }
const inflight = new Map() // key -> Promise

function refresh(key, ttlMs, loader) {
  const task = Promise.resolve()
    .then(loader)
    .then((value) => {
      store.set(key, { value, expire: Date.now() + ttlMs, at: Date.now() })
      return value
    })
    .finally(() => {
      inflight.delete(key)
    })

  inflight.set(key, task)
  return task
}

/**
 * @param {string} key      缓存键，按业务前缀命名（home / orchids:xxx / orchid:slug）
 * @param {number} ttlMs    新鲜期，过期后走 SWR 后台刷新
 * @param {Function} loader 真正的取数逻辑（返回 Promise）
 */
export async function cached(key, ttlMs, loader) {
  const entry = store.get(key)

  // 新鲜：直接命中
  if (entry && entry.expire > Date.now()) return entry.value

  // 陈旧但有旧值：先给旧值，后台刷新（刷新失败保留旧值，不把错误抛给用户）
  if (entry) {
    if (!inflight.has(key)) refresh(key, ttlMs, loader).catch(() => {})
    return entry.value
  }

  // 无缓存：单飞，并发请求共享同一次查询
  if (inflight.has(key)) return inflight.get(key)
  return refresh(key, ttlMs, loader)
}

/**
 * 清除缓存。后台写入后调用，保证前台尽快看到新内容。
 * @param {string} [prefix] 只清除指定前缀；不传则全清
 */
export function invalidateCache(prefix = '') {
  let count = 0
  for (const key of [...store.keys()]) {
    if (!prefix || key.startsWith(prefix)) {
      store.delete(key)
      count++
    }
  }
  return count
}

/** 当前缓存概况，便于排查（/api/cache-stats 可选使用） */
export function cacheStats() {
  const now = Date.now()
  let fresh = 0
  for (const entry of store.values()) if (entry.expire > now) fresh++
  return { total: store.size, fresh, stale: store.size - fresh, inflight: inflight.size }
}

/**
 * 节流：同一个 key 在 ms 内只允许通过一次。
 * 用于浏览量自增这类「每次请求都想写库、但完全不必每次都写」的场景，
 * 避免缓存命中时仍然为每个请求消耗一条跨洋数据库连接。
 */
const throttles = new Map() // key -> 上次通过的时间

export function onceIn(key, ms) {
  const now = Date.now()
  const last = throttles.get(key) || 0
  if (now - last < ms) return false
  throttles.set(key, now)
  // 顺手清理，避免 key 无限增长
  if (throttles.size > 5000) {
    for (const [k, t] of throttles) if (now - t > ms) throttles.delete(k)
  }
  return true
}
