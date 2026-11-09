/**
 * 表单 -> 数据库字段的归一化，新增/编辑共用
 * 只接受白名单字段，避免前端误传字段污染数据
 */

const STATUS = ['published', 'draft']

function status(value, fallback = 'published') {
  return STATUS.includes(value) ? value : fallback
}

export function orchidData(body = {}) {
  const data = pick(body, [
    'name',
    'alias',
    'cover',
    'summary',
    'content',
    'origin',
    'flowering',
    'fragrance',
    'difficulty',
    'light'
  ])

  if (data.name !== undefined) data.name = String(data.name).trim()
  if (data.alias !== undefined) data.alias = String(data.alias).trim()

  if (body.slug !== undefined) data.slug = String(body.slug).trim()
  if (body.categoryId !== undefined) data.categoryId = toInt(body.categoryId)
  if (body.images !== undefined) data.images = toList(body.images)
  if (body.tags !== undefined) data.tags = toList(body.tags)
  if (body.isFeatured !== undefined) data.isFeatured = toBool(body.isFeatured)
  if (body.sortOrder !== undefined) data.sortOrder = toInt(body.sortOrder)
  if (body.status !== undefined) data.status = status(body.status)

  return data
}

export function categoryData(body = {}) {
  const data = pick(body, ['name', 'subtitle', 'description', 'cover'])

  if (data.name !== undefined) data.name = String(data.name).trim()
  if (body.slug !== undefined) data.slug = String(body.slug).trim()
  if (body.sortOrder !== undefined) data.sortOrder = toInt(body.sortOrder)
  if (body.isActive !== undefined) data.isActive = toBool(body.isActive)

  return data
}

export function articleData(body = {}) {
  const data = pick(body, ['title', 'cover', 'summary', 'content', 'author'])

  if (data.title !== undefined) data.title = String(data.title).trim()

  if (body.slug !== undefined) data.slug = String(body.slug).trim()
  if (body.category !== undefined) data.category = String(body.category).trim() || '兰文化'
  if (body.tags !== undefined) data.tags = toList(body.tags)
  if (body.isTop !== undefined) data.isTop = toBool(body.isTop)
  if (body.status !== undefined) data.status = status(body.status)
  if (body.publishedAt) {
    const date = new Date(body.publishedAt)
    if (!Number.isNaN(date.getTime())) data.publishedAt = date
  }

  return data
}

export function bannerData(body = {}) {
  const data = pick(body, ['title', 'subtitle', 'image', 'link'])

  if (data.title !== undefined) data.title = String(data.title).trim()
  if (body.sortOrder !== undefined) data.sortOrder = toInt(body.sortOrder)
  if (body.isActive !== undefined) data.isActive = toBool(body.isActive)

  return data
}
