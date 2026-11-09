<template>
  <div>
    <PageHero
      title="兰文"
      en="ESSAYS & NOTES"
      subtitle="瓣型鉴赏、四季养护、兰室清供。关于兰的一切，都值得慢慢写、慢慢读。"
    />

    <section class="container py-12 md:py-16">
      <div class="flex flex-col gap-5 border-b border-[#E3DBC9]/70 pb-6 md:flex-row md:items-center md:justify-between">
        <div class="-mx-1 flex flex-nowrap items-center gap-1 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
          <button
            v-for="item in tabs"
            :key="item.value"
            class="shrink-0 border px-4 py-2 font-song text-[13px] tracking-[0.12em] transition-colors"
            :class="
              (route.query.category || '') === item.value
                ? 'border-jade-deep bg-jade-deep text-paper'
                : 'border-[#E3DBC9] text-ink-soft hover:border-gold'
            "
            @click="setQuery({ category: item.value || undefined, page: undefined })"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="relative w-full md:w-64">
          <van-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gold/80" />
          <input
            v-model="keyword"
            type="search"
            placeholder="搜索文章标题"
            class="w-full border border-[#E3DBC9] bg-paper-light/60 py-2.5 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors placeholder:text-ink-light/60 focus:border-gold"
            @input="onSearch"
          />
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between text-[11px] tracking-[0.1em] text-ink-light">
        <span>共 {{ data?.total || 0 }} 篇</span>
        <span v-if="route.query.keyword" class="text-cinnabar/70">关键词：{{ route.query.keyword }}</span>
      </div>

      <div v-if="pending" class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="index in 6" :key="index" class="animate-pulse">
          <div class="aspect-[16/10] bg-paper-deep/70" />
          <div class="mt-3 h-3 w-3/4 bg-paper-deep/70" />
          <div class="mt-2 h-3 w-1/2 bg-paper-deep/50" />
        </div>
      </div>

      <template v-else-if="data?.list?.length">
        <!-- 头条 -->
        <NuxtLink
          v-if="featured"
          :to="`/articles/${featured.slug}`"
          class="group mt-8 grid gap-6 border border-[#E3DBC9] bg-paper-light/50 p-4 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-10 md:p-6"
        >
          <SmartImage :src="featured.cover" :alt="featured.title" ratio="16 / 10" w="720" img-class="group-hover:scale-[1.03]">
            <span class="absolute left-3 top-3 bg-cinnabar px-2 py-0.5 text-[10px] tracking-[0.2em] text-paper">
              头条
            </span>
          </SmartImage>
          <div class="md:pr-4">
            <p class="text-[11px] tracking-[0.2em] text-gold-deep">{{ featured.category }} · {{ formatDate(featured.publishedAt) }}</p>
            <h2 class="mt-3 font-song text-[22px] leading-9 tracking-[0.06em] text-jade-deep transition-colors group-hover:text-cinnabar md:text-[28px]">
              {{ featured.title }}
            </h2>
            <p class="mt-3 line-clamp-3 text-[13px] leading-7 text-ink-soft/75">{{ featured.summary }}</p>
            <span class="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.25em] text-jade-deep">
              阅读全文
              <van-icon name="arrow" size="11" class="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </NuxtLink>

        <div class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ArticleCard v-for="article in rest" :key="article.id" :article="article" />
        </div>
      </template>

      <EmptyState v-else text="暂无相关文章" hint="换个关键词或分类试试" />

      <div class="mt-14">
        <Pager :page="data?.page || 1" :total-pages="data?.totalPages || 1" @change="changePage" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { formatDate } from '~/utils/date'

const route = useRoute()
const router = useRouter()

const keyword = ref(String(route.query.keyword || ''))

const tabs = [
  { label: '全部', value: '' },
  { label: '兰文化', value: '兰文化' },
  { label: '鉴赏', value: '鉴赏' },
  { label: '养护', value: '养护' },
  { label: '动态', value: '动态' }
]

const { data, pending } = await useFetch('/api/articles', {
  key: 'article-list',
  query: computed(() => ({
    page: route.query.page || 1,
    pageSize: 9,
    category: route.query.category || undefined,
    keyword: route.query.keyword || undefined
  }))
})

const showFeatured = computed(() => !route.query.category && !route.query.keyword && (data.value?.page || 1) === 1)
const featured = computed(() => (showFeatured.value ? data.value?.list?.[0] : null))
const rest = computed(() => (featured.value ? data.value.list.slice(1) : data.value?.list || []))

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  Object.keys(query).forEach((key) => {
    if (!query[key]) delete query[key]
  })
  router.push({ path: '/articles', query })
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
  title: '兰文',
  meta: [{ name: 'description', content: '国兰文化、瓣型鉴赏、养护知识与兰界动态。' }]
})
</script>
