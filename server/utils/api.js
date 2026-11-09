import { prisma } from './prisma'

/**
 * 统一分页参数：?page=1&pageSize=12
 */
export function getPaging(event, defaultSize = 12) {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(60, Math.max(1, Number(query.pageSize) || defaultSize))
  return { query, page, pageSize, skip: (page - 1) * pageSize, take: pageSize }
}

/**
 * 一次事务内取列表与总数，返回前端直接可用的结构
 */
export async function pagedList(model, { where, include, select, orderBy, page, pageSize, skip, take }) {
  const [list, total] = await prisma.$transaction([
    model.findMany({ where, include, select, orderBy, skip, take }),
    model.count({ where })
  ])
  return { list, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

/**
 * 白名单取值：只接收表单里允许的字段，避免脏数据写入
 */
export function pick(source = {}, fields = []) {
  const data = {}
  for (const field of fields) {
    if (source[field] !== undefined) data[field] = source[field]
  }
  return data
}

/** 字符串数组字段兼容 "a,b"、["a","b"]、多行文本 */
export function toList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  return String(value || '')
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function toInt(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? Math.trunc(num) : fallback
}

export function toBool(value) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

/** 必填校验 */
export function required(value, label) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw createError({ statusCode: 400, message: `${label}不能为空` })
  }
}

/** 生成唯一 slug：未填写时按前缀 + 时间戳兜底 */
export function makeSlug(input, prefix = 'item') {
  const raw = String(input || '').trim()
  if (raw) {
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80)
  }
  return `${prefix}-${Date.now().toString(36)}`
}

/** 解析 [id] 路由参数 */
export function getId(event) {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: '无效的 ID' })
  }
  return id
}

/** Prisma 唯一约束等错误的友好提示 */
export async function guard(fn) {
  try {
    return await fn()
  } catch (error) {
    if (error?.code === 'P2002') {
      throw createError({ statusCode: 400, message: '标识（slug）已存在，请换一个' })
    }
    if (error?.code === 'P2025') {
      throw createError({ statusCode: 404, message: '记录不存在或已被删除' })
    }
    throw error
  }
}
