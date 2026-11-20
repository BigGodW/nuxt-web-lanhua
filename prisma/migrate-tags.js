/* eslint-disable no-console */
/**
 * 一次性迁移脚本：把 orchids.tags / articles.tags 两个字符串数组列
 * 搬进 tags 表，并建立多对多关联。
 * 用法：node --env-file=.env prisma/migrate-tags.js
 * 跑完并确认前台标签正常后，再从 schema 删除 legacyTags 字段并 db push。
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

async function main() {
  let tagCount = 0
  let orchidLinks = 0
  let articleLinks = 0

  const orchids = await prisma.orchid.findMany({ select: { id: true, legacyTags: true } })
  for (const orchid of orchids) {
    for (const name of orchid.legacyTags || []) {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: slugify(name) }
      })
      await prisma.orchid.update({
        where: { id: orchid.id },
        data: { tags: { connect: { id: tag.id } } }
      })
      orchidLinks++
    }
  }

  const articles = await prisma.article.findMany({ select: { id: true, legacyTags: true } })
  for (const article of articles) {
    for (const name of article.legacyTags || []) {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: slugify(name) }
      })
      await prisma.article.update({
        where: { id: article.id },
        data: { tags: { connect: { id: tag.id } } }
      })
      articleLinks++
    }
  }

  tagCount = await prisma.tag.count()

  console.log(`✓ tags 表共 ${tagCount} 个标签`)
  console.log(`✓ 建立兰花标签关联 ${orchidLinks} 条`)
  console.log(`✓ 建立文章标签关联 ${articleLinks} 条`)
  console.log('\n确认无误后：从 schema.prisma 删除 legacyTags 字段，再执行 npx prisma db push')
}

main()
  .catch((error) => {
    console.error('迁移失败：', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
