import { PrismaClient } from '@prisma/client'

// 开发环境热更新时复用同一个连接，避免连接池被耗尽
const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.__guolanPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__guolanPrisma = prisma
}
