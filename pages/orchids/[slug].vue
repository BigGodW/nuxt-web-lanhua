<template>
  <div v-if="orchid">
    <!-- 面包屑 -->
    <div class="border-b border-[#E3DBC9]/60 bg-paper-light/40">
      <div class="container flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-[11px] tracking-[0.1em] text-ink-light">
        <NuxtLink to="/" class="hover:text-jade-deep">首页</NuxtLink>
        <span class="text-gold/60">/</span>
        <NuxtLink to="/orchids" class="hover:text-jade-deep">兰谱</NuxtLink>
        <span class="text-gold/60">/</span>
        <NuxtLink v-if="orchid.category" :to="`/categories/${orchid.category.slug}`" class="hover:text-jade-deep">
          {{ orchid.category.name }}
        </NuxtLink>
        <span class="text-gold/60">/</span>
        <span class="text-ink">{{ orchid.name }}</span>
      </div>
    </div>

    <section class="container py-7 md:py-14">
      <div class="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-16">
        <!-- 图 -->
        <div>
          <div class="pattern-frame p-2">
            <SmartImage :src="activeImage || orchid.cover" :alt="orchid.name" ratio="4 / 5" w="820">
              <span
                v-if="orchid.isFeatured"
                class="absolute right-3 top-3 bg-cinnabar px-2 py-1 font-song text-[10px] tracking-[0.2em] text-paper"
              >
                名品
              </span>
            </SmartImage>
          </div>

          <div v-if="gallery.length > 1" class="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0">
            <button
              v-for="(image, index) in gallery"
              :key="index"
              class="h-16 w-16 shrink-0 overflow-hidden border transition-colors"
              :class="activeImage === image ? 'border-cinnabar' : 'border-[#E3DBC9] hover:border-gold'"
              @click="activeImage = image"
            >
              <img :src="thumb(image)" :alt="`${orchid.name} 图 ${index + 1}`" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <!-- 信息 -->
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink
              v-if="orchid.category"
              :to="`/categories/${orchid.category.slug}`"
              class="border border-gold/50 px-2.5 py-1 font-song text-[11px] tracking-[0.15em] text-gold-deep transition-colors hover:bg-gold/10"
            >
              {{ orchid.category.name }}
            </NuxtLink>
            <span class="text-[11px] tracking-[0.12em] text-ink-light">浏览量 {{ orchid.viewCount }}</span>
          </div>

          <h1 class="mt-3 font-song text-[26px] leading-tight tracking-[0.12em] text-jade-deep md:mt-4 md:text-[42px] md:tracking-[0.18em]">
            {{ orchid.name }}
          </h1>
          <p v-if="orchid.alias" class="mt-2 font-song text-[13px] tracking-[0.18em] text-ink-light">
            又名 · {{ orchid.alias }}
          </p>

          <div class="mt-4 flex items-center gap-3 md:mt-5">
            <span class="h-px w-10 bg-gold/60" />
            <span class="text-[10px] tracking-[0.3em] text-gold-deep/70">ORCHID PROFILE</span>
          </div>

          <p v-if="orchid.summary" class="mt-4 font-song text-[13.5px] leading-7 text-ink-soft/90 md:mt-5 md:text-[14px] md:leading-8">
            {{ orchid.summary }}
          </p>

          <dl class="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-[#E3DBC9] bg-[#E3DBC9] md:mt-7">
            <div v-for="item in profile" :key="item.label" class="bg-paper-light/80 px-3.5 py-3 md:px-4 md:py-3.5">
              <dt class="text-[10px] tracking-[0.2em] text-ink-light">{{ item.label }}</dt>
              <dd class="mt-1 font-song text-[13px] text-jade-deep">{{ item.value }}</dd>
            </div>
          </dl>

          <div v-if="orchid.tags?.length" class="mt-4 flex flex-wrap gap-2 md:mt-5">
            <span
              v-for="tag in orchid.tags"
              :key="tag"
              class="border border-[#E3DBC9] px-2.5 py-1 text-[11px] text-ink-soft"
            >
              # {{ tag }}
            </span>
          </div>

          <!-- 手机端一行排布：两个文字按钮 + 一个图标按钮，省掉三行的高度 -->
          <div class="mt-6 flex flex-wrap items-center gap-2 md:mt-8 md:gap-3">
            <NuxtLink
              to="/orchids"
              class="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-jade-deep px-4 font-song text-[13px] tracking-[0.14em] text-paper transition-colors hover:bg-jade sm:flex-none sm:px-5 sm:tracking-[0.2em] md:h-auto md:py-3"
            >
              返回兰谱
            </NuxtLink>
            <NuxtLink
              v-if="orchid.category"
              :to="`/categories/${orchid.category.slug}`"
              class="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-jade-deep/30 px-4 font-song text-[13px] tracking-[0.14em] text-jade-deep transition-colors hover:border-jade-deep sm:flex-none sm:px-5 sm:tracking-[0.2em] md:h-auto md:py-3"
            >
              更多{{ orchid.category.name }}
            </NuxtLink>
            <button
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-[#E3DBC9] text-ink-soft transition-colors hover:border-cinnabar hover:text-cinnabar sm:w-auto sm:gap-2 sm:px-5 md:h-auto md:py-3"
              aria-label="分享此兰"
              @click="shareOpen = true"
            >
              <van-icon name="share-o" size="14" />
              <span class="hidden font-song text-[13px] tracking-[0.2em] sm:inline">分享此兰</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 详解 + 同类 -->
    <section class="border-t border-[#E3DBC9]/60 bg-paper-light/40 py-10 md:py-16">
      <div class="container grid gap-8 md:gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <article>
          <SectionTitle title="品种详解" en="DETAILS & CULTIVATION" />
          <div v-if="orchid.content" class="article-body mt-5 md:mt-6" v-html="orchid.content" />
          <p v-else class="mt-5 text-[13px] text-ink-light md:mt-6">该品种的详细介绍正在整理中。</p>
        </article>

        <aside class="lg:border-l lg:border-[#E3DBC9] lg:pl-8">
          <p class="font-song text-[13px] tracking-[0.2em] text-jade-deep">同类品种</p>
          <div class="mt-4 space-y-4 md:mt-5 md:space-y-5">
            <NuxtLink
              v-for="item in orchid.related"
              :key="item.id"
              :to="`/orchids/${item.slug}`"
              class="group flex gap-3"
            >
              <SmartImage :src="item.cover" :alt="item.name" ratio="1 / 1" w="140" class="w-16 shrink-0" img-class="group-hover:scale-105" />
              <div class="min-w-0">
                <p class="font-song text-[14px] tracking-[0.1em] text-ink transition-colors group-hover:text-cinnabar">
                  {{ item.name }}
                </p>
                <p class="mt-1 line-clamp-2 text-[11px] leading-5 text-ink-light">{{ item.summary }}</p>
              </div>
            </NuxtLink>

            <p v-if="!orchid.related?.length" class="text-[12px] text-ink-light">暂无同类品种</p>
          </div>
        </aside>
      </div>
    </section>

    <ShareSheet
      v-model="shareOpen"
      :title="orchid.name + '｜国兰品种'"
      :desc="orchid.summary || ''"
      :image="orchid.cover || ''"
      :path="`/orchids/${orchid.slug}`"
      :tag="orchid.category?.name ? `${orchid.category.name} · 国兰清赏` : '国兰清赏'"
      label="兰"
    />
  </div>
</template>

<script setup>
const route = useRoute()

const { data: orchid, error } = await useFetch(`/api/orchids/${route.params.slug}`, {
  key: `orchid-${route.params.slug}`
})

if (error.value || !orchid.value) {
  throw createError({ statusCode: 404, statusMessage: '该品种不存在或已下架', fatal: true })
}

const { img } = useImage()
const { absolute, shareImage } = useShare()

const shareOpen = ref(false)
const thumb = (src) => img(src, 160)

const activeImage = ref('')
const gallery = computed(() => {
  const images = orchid.value?.images || []
  return images.length ? images : orchid.value?.cover ? [orchid.value.cover] : []
})

const profile = computed(() => {
  const item = orchid.value || {}
  return [
    { label: '产地', value: item.origin || '—' },
    { label: '花期', value: item.flowering || '—' },
    { label: '香气', value: item.fragrance || '—' },
    { label: '养护难度', value: item.difficulty || '—' },
    { label: '光照', value: item.light || '—' },
    { label: '品类', value: item.category?.name || '—' }
  ]
})

const absoluteUrl = computed(() => absolute(`/orchids/${orchid.value?.slug || ''}`))
const shareImg = computed(() => shareImage(orchid.value?.cover, 500))

useSeoMeta({
  title: () => orchid.value?.name || '品种详情',
  description: () => orchid.value?.summary || '',
  ogTitle: () => (orchid.value?.name ? `${orchid.value.name} · ${orchid.value.category?.name || '国兰'}` : '国兰品种'),
  ogDescription: () => orchid.value?.summary || '',
  ogType: 'article',
  ogUrl: () => absoluteUrl.value,
  ogImage: () => shareImg.value,
  ogImageWidth: 500,
  ogImageHeight: 625,
  twitterCard: 'summary_large_image'
})
</script>
