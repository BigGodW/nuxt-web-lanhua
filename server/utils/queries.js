/**
 * 前台只读数据的加载器（接口与缓存预热共用）
 *
 * 集中在这里的原因：接口和启动预热必须用「同一个缓存 key + 同一段查询」，
 * 否则预热写进去的 key 和接口读的 key 对不上，等于白热。
 * 数据库在海外，单次往返 400ms+，这里的每个 loader 都是一次完整的数据快照。
 */
import { prisma } from './prisma.js'
import { cached } from './cache.js'
import { pagedList } from './api.js'

const MINUTE = 60 * 1000

/** 站点配置：变化极少，缓存 5 分钟 */
export function loadSettings() {
  return cached('settings', 5 * MINUTE, async () => {
    const rows = await prisma.setting.findMany()
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})
  })
}

/** 品类清单：缓存 2 分钟 */
export function loadCategories() {
  return cached('categories', 2 * MINUTE, async () => {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: { _count: { select: { orchids: { where: { status: 'published' } } } } }
    })
  })
}

/** 首页聚合数据：缓存 60 秒 */
export function loadHome() {
  return cached('home', MINUTE, async () => {
    // 与原来 6 条独立查询相比：
    // 1. categories 直接复用 loadCategories()，通常已预热命中，0 次往返；
    // 2. 两个 count 合并成一条 SQL（表名取 schema 里 @@map 的 orchids / articles）。
    const [banners, categories, featured, articles, counts] = await Promise.all([
      prisma.banner.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] }),
      loadCategories(),
      prisma.orchid.findMany({
        where: { status: 'published', isFeatured: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: 6,
        // 首屏卡片用不到正文，省掉大字段传输
        select: {
          id: true,
          name: true,
          alias: true,
          slug: true,
          cover: true,
          summary: true,
          flowering: true,
          fragrance: true,
          tags: true,
          category: { select: { name: true, slug: true } }
        }
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          cover: true,
          summary: true,
          category: true,
          author: true,
          publishedAt: true,
          viewCount: true
        }
      }),
      prisma.$queryRaw`SELECT
        (SELECT COUNT(*)::int FROM orchids WHERE status = 'published') AS orchids,
        (SELECT COUNT(*)::int FROM articles WHERE status = 'published') AS articles`
    ])

    const orchidCount = counts?.[0]?.orchids || 0
    const articleCount = counts?.[0]?.articles || 0

    return {
      banners,
      categories,
      featured,
      articles,
      stats: { orchids: orchidCount, articles: articleCount, categories: categories.length }
    }
  })
}

/**
 * 列表缓存 key：接口与预热必须用同一套规则，
 * 否则参数顺序不同就会变成两个 key，预热等于没用。
 */
export function orchidListKey({ page = 1, pageSize = 12, category = '', keyword = '', featured = '' } = {}) {
  return `orchids:${page}:${pageSize}:${category}:${keyword}:${featured}`
}

export function articleListKey({ page = 1, pageSize = 8, category = '', keyword = '' } = {}) {
  return `articles:${page}:${pageSize}:${category}:${keyword}`
}

/** 品种列表：筛选条件 + 分页整体缓存 60s */
export function loadOrchidList(params = {}) {
  const { page = 1, pageSize = 12, category = '', keyword = '', featured = '' } = params

  return cached(orchidListKey(params), MINUTE, async () => {
    const where = { status: 'published' }
    if (category) where.category = { slug: String(category) }
    if (featured === '1') where.isFeatured = true
    if (keyword && String(keyword).trim()) {
      const kw = String(keyword).trim()
      where.OR = [
        { name: { contains: kw, mode: 'insensitive' } },
        { alias: { contains: kw, mode: 'insensitive' } },
        { summary: { contains: kw, mode: 'insensitive' } },
        { tags: { has: kw } }
      ]
    }

    return pagedList(prisma.orchid, {
      where,
      select: {
        id: true,
        name: true,
        alias: true,
        slug: true,
        cover: true,
        summary: true,
        flowering: true,
        fragrance: true,
        difficulty: true,
        tags: true,
        isFeatured: true,
        category: { select: { name: true, slug: true } }
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      page,
      pageSize,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  })
}

/** 文章列表：筛选条件 + 分页整体缓存 60s */
export function loadArticleList(params = {}) {
  const { page = 1, pageSize = 8, category = '', keyword = '' } = params

  return cached(articleListKey(params), MINUTE, async () => {
    const where = { status: 'published' }
    if (category) where.category = String(category)
    if (keyword && String(keyword).trim()) {
      const kw = String(keyword).trim()
      where.OR = [
        { title: { contains: kw, mode: 'insensitive' } },
        { summary: { contains: kw, mode: 'insensitive' } }
      ]
    }

    return pagedList(prisma.article, {
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        cover: true,
        summary: true,
        category: true,
        author: true,
        tags: true,
        isTop: true,
        viewCount: true,
        publishedAt: true
      },
      orderBy: [{ isTop: 'desc' }, { publishedAt: 'desc' }],
      page,
      pageSize,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  })
}
