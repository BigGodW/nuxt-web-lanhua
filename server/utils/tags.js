/**
 * 标签（Tag 表）的写入工具
 *
 * 后台表单仍然传「标签名数组」（逗号分隔的文本在表单层拆好），
 * 这里统一转成 Prisma 的 connectOrCreate：
 * - 已存在同名标签 → 直接关联
 * - 不存在 → 自动创建（slug 由名称生成，中文名直接作 slug，URL 里会编码显示）
 */
import { toList, makeSlug } from './api.js'

const MAX_TAGS = 12

export function tagOps(value) {
  const names = [...new Set(toList(value))].filter(Boolean).slice(0, MAX_TAGS)
  return {
    set: [],
    connectOrCreate: names.map((name) => ({
      where: { name },
      create: { name, slug: makeSlug(name, 'tag') }
    }))
  }
}
