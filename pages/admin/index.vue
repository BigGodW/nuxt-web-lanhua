<template>
  <div class="space-y-5">
    <!-- 数据概览 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="(item, index) in cards"
        :key="item.label"
        class="relative overflow-hidden border border-[#E3DBC9] bg-paper-light px-5 py-5"
      >
        <span class="absolute right-4 top-4 font-song text-[11px] tracking-[0.2em] text-gold/50">
          {{ cnNumber(index) }}
        </span>
        <p class="text-[11px] tracking-[0.15em] text-ink-light">{{ item.label }}</p>
        <p class="mt-3 font-song text-[30px] leading-none text-jade-deep">
          {{ item.value }}
          <span class="ml-1 text-[11px] text-ink-light">{{ item.unit }}</span>
        </p>
        <p class="mt-2 text-[11px] text-ink-light">{{ item.hint }}</p>
        <span class="absolute bottom-0 left-0 h-0.5 w-10 bg-cinnabar/70" />
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-2">
      <!-- 最近品种 -->
      <AdminCard title="最近新增品种" hint="按创建时间">
        <template #action>
          <NuxtLink to="/admin/orchids" class="text-[11px] text-ink-light hover:text-cinnabar">品种管理 →</NuxtLink>
        </template>

        <div v-if="stats?.recentOrchids?.length" class="divide-y divide-[#E3DBC9]/70">
          <div v-for="item in stats.recentOrchids" :key="item.id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="truncate font-song text-[13px] text-ink">{{ item.name }}</p>
              <p class="mt-0.5 text-[11px] text-ink-light">{{ item.category?.name }} · {{ formatDate(item.createdAt) }}</p>
            </div>
            <span class="status-badge" :class="item.status === 'published' ? 'status-published' : 'status-draft'">
              {{ item.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>
        </div>
        <p v-else class="py-8 text-center text-[12px] text-ink-light">暂无品种，去添加第一个吧</p>
      </AdminCard>

      <!-- 最近文章 -->
      <AdminCard title="最近文章" hint="按发布时间">
        <template #action>
          <NuxtLink to="/admin/articles" class="text-[11px] text-ink-light hover:text-cinnabar">文章管理 →</NuxtLink>
        </template>

        <div v-if="stats?.recentArticles?.length" class="divide-y divide-[#E3DBC9]/70">
          <div v-for="item in stats.recentArticles" :key="item.id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="truncate font-song text-[13px] text-ink">{{ item.title }}</p>
              <p class="mt-0.5 text-[11px] text-ink-light">{{ item.category }} · {{ formatDate(item.createdAt) }}</p>
            </div>
            <span class="status-badge" :class="item.status === 'published' ? 'status-published' : 'status-draft'">
              {{ item.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </div>
        </div>
        <p v-else class="py-8 text-center text-[12px] text-ink-light">暂无文章</p>
      </AdminCard>
    </div>

    <!-- 快捷入口 -->
    <AdminCard title="快捷操作" hint="常用入口">
      <div class="grid gap-3 sm:grid-cols-3">
        <NuxtLink
          v-for="action in actions"
          :key="action.to"
          :to="action.to"
          class="group flex items-center justify-between border border-[#E3DBC9] bg-paper px-4 py-3.5 transition-colors hover:border-gold"
        >
          <span class="flex items-center gap-2.5">
            <van-icon :name="action.icon" size="16" class="text-jade-light" />
            <span class="font-song text-[13px] tracking-[0.08em] text-jade-deep">{{ action.label }}</span>
          </span>
          <van-icon name="arrow" size="11" class="text-gold/70 transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>
    </AdminCard>
  </div>
</template>

<script setup>
import { cnNumber, formatDate } from '~/utils/date'

definePageMeta({ layout: 'admin' })

const { data: stats } = await useFetch('/api/admin/stats', { key: 'admin-stats' })

const cards = computed(() => [
  {
    label: '在录品种',
    value: stats.value?.counts?.orchids || 0,
    unit: '品',
    hint: `${stats.value?.counts?.drafts || 0} 条草稿待完善`
  },
  {
    label: '兰文篇数',
    value: stats.value?.counts?.articles || 0,
    unit: '篇',
    hint: '含兰文化、鉴赏与养护'
  },
  {
    label: '品类数量',
    value: stats.value?.counts?.categories || 0,
    unit: '类',
    hint: '春兰、蕙兰、建兰等'
  },
  {
    label: '累计浏览',
    value: stats.value?.counts?.views || 0,
    unit: '次',
    hint: '品种详情页浏览量'
  }
])

const actions = [
  { label: '新增品种', to: '/admin/orchids', icon: 'flower-o' },
  { label: '撰写文章', to: '/admin/articles', icon: 'edit' },
  { label: '站点设置', to: '/admin/settings', icon: 'setting-o' }
]

useHead({ title: '仪表盘' })
</script>
