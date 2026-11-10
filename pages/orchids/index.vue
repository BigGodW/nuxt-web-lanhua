<template>
  <div>
    <PageHero
      title="兰谱"
      en="ORCHID CATALOG"
      subtitle="依品类检索国兰名品，观其瓣型、花期、香气与产地。一草一木，皆有来历。"
    />

    <section class="container py-8 md:py-16">
      <!-- 筛选 -->
      <div class="flex flex-col gap-4 border-b border-[#E3DBC9]/70 pb-4 md:flex-row md:items-center md:justify-between md:gap-5 md:pb-6">
        <div class="no-scrollbar -mx-1 flex flex-nowrap items-center gap-1 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
          <button
            class="shrink-0 border px-3.5 py-1.5 font-song text-[12.5px] tracking-[0.1em] transition-colors md:px-4 md:py-2.5 md:text-[13px] md:tracking-[0.12em]"
            :class="!route.query.category ? 'border-jade-deep bg-jade-deep text-paper' : 'border-[#E3DBC9] text-ink-soft hover:border-gold'"
            @click="setQuery({ category: undefined, page: undefined })"
          >
            全部
          </button>
          <button
            v-for="category in categories || []"
            :key="category.id"
            class="shrink-0 border px-3.5 py-1.5 font-song text-[12.5px] tracking-[0.1em] transition-colors md:px-4 md:py-2.5 md:text-[13px] md:tracking-[0.12em]"
            :class="
              route.query.category === category.slug
                ? 'border-jade-deep bg-jade-deep text-paper'
                : 'border-[#E3DBC9] text-ink-soft hover:border-gold'
            "
            @click="setQuery({ category: category.slug, page: undefined })"
          >
            {{ category.name }}
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <van-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gold/80" />
          <input
            v-model="keyword"
            type="search"
            placeholder="搜索品种、别名或标签"
            class="w-full border border-[#E3DBC9] bg-paper-light/60 py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-light/60 focus:border-gold md:py-2.5"
            @input="onSearch"
          />
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between text-[11px] tracking-[0.1em] text-ink-light md:mt-5">
        <span>共 {{ data?.total || 0 }} 个品种</span>
        <span v-if="route.query.keyword" class="text-cinnabar/70">关键词：{{ route.query.keyword }}</span>
      </div>

      <!-- 列表 -->
      <div v-if="pending" class="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
        <div v-for="index in 8" :key="index" class="animate-pulse">
          <div class="aspect-[4/5] bg-paper-deep/70" />
          <div class="mt-3 h-3 w-2/3 bg-paper-deep/70" />
          <div class="mt-2 h-3 w-1/2 bg-paper-deep/50" />
        </div>
      </div>

      <div v-else-if="data?.list?.length" class="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
        <OrchidCard v-for="orchid in data.list" :key="orchid.id" :orchid="orchid" />
      </div>

      <EmptyState v-else text="未找到相关兰草" hint="换个关键词，或选择其他品类看看" />

      <div class="mt-9 md:mt-14">
        <Pager :page="data?.page || 1" :total-pages="data?.totalPages || 1" @change="changePage" />
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const keyword = ref(String(route.query.keyword || ''))

// 品类与列表互不依赖，并行发起，避免两次串行等待
const [{ data: categories }, { data, pending }] = await Promise.all([
  useFetch('/api/categories', { key: 'categories-list' }),
  useFetch('/api/orchids', {
    key: 'orchid-list',
    query: computed(() => ({
      page: route.query.page || 1,
      pageSize: 12,
      category: route.query.category || undefined,
      keyword: route.query.keyword || undefined
    }))
  })
])

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  Object.keys(query).forEach((key) => {
    if (!query[key]) delete query[key]
  })
  router.push({ path: '/orchids', query })
}

let timer = null
function onSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    setQuery({ keyword: keyword.value.trim() || undefined, page: undefined })
  }, 420)
}

function changePage(page) {
  setQuery({ page })
  if (import.meta.client) window.scrollTo({ top: 260, behavior: 'smooth' })
}

useHead({
  title: '兰谱',
  meta: [{ name: 'description', content: '九畹国兰谱：按春兰、蕙兰、建兰、墨兰、寒兰、春剑、莲瓣兰检索中国兰花名品。' }]
})
</script>
