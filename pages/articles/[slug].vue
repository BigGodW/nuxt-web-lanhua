<template>
  <div v-if="article">
    <div class="border-b border-[#E3DBC9]/60 bg-paper-light/40">
      <div class="container flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-[11px] tracking-[0.1em] text-ink-light">
        <NuxtLink to="/" class="hover:text-jade-deep">首页</NuxtLink>
        <span class="text-gold/60">/</span>
        <NuxtLink to="/articles" class="hover:text-jade-deep">兰文</NuxtLink>
        <span class="text-gold/60">/</span>
        <NuxtLink :to="`/articles?category=${encodeURIComponent(article.category)}`" class="hover:text-jade-deep">
          {{ article.category }}
        </NuxtLink>
      </div>
    </div>

    <article class="pb-10 md:pb-16">
      <!-- 标题区 -->
      <header class="container max-w-3xl pb-6 pt-8 text-center md:pb-10 md:pt-16">
        <p class="text-[10px] tracking-[0.4em] text-gold-deep/80">{{ article.category }}</p>
        <h1 class="mt-3 font-song text-[23px] leading-[1.5] tracking-[0.06em] text-jade-deep md:mt-4 md:text-[36px] md:leading-[1.55] md:tracking-[0.08em]">
          {{ article.title }}
        </h1>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] tracking-[0.12em] text-ink-light md:mt-5">
          <span>{{ article.author }}</span>
          <span class="h-2.5 w-px bg-gold/50" />
          <span>{{ formatDate(article.publishedAt) }}</span>
          <span class="h-2.5 w-px bg-gold/50" />
          <span>阅读 {{ article.viewCount }}</span>
        </div>
        <div class="ornament mx-auto mt-6 max-w-xs text-[10px] tracking-[0.3em] md:mt-8">
          <span>蜀杨兰园</span>
        </div>
      </header>

      <!-- 封面 -->
      <div v-if="article.cover" class="container max-w-5xl">
        <SmartImage :src="article.cover" :alt="article.title" ratio="21 / 9" w="1100" class="pattern-frame p-1.5" />
      </div>

      <!-- 正文 -->
      <div class="container mt-6 max-w-3xl md:mt-10">
        <p v-if="article.summary" class="border-l-2 border-gold/60 bg-paper-light/60 px-4 py-3.5 font-song text-[12.5px] leading-6 text-ink-soft/85 md:px-5 md:py-4 md:text-[13px] md:leading-7">
          {{ article.summary }}
        </p>

        <div v-if="article.content" class="article-body mt-7 md:mt-9" v-html="article.content" />
        <p v-else class="mt-7 text-[13px] text-ink-light md:mt-9">正文正在整理中。</p>

        <div v-if="article.tags?.length" class="mt-8 flex flex-wrap gap-2 border-t border-[#E3DBC9]/70 pt-5 md:mt-10 md:pt-6">
          <span v-for="tag in article.tags" :key="tag" class="border border-[#E3DBC9] px-3 py-1 text-[11px] text-ink-soft">
            # {{ tag }}
          </span>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-4 md:mt-8">
          <NuxtLink to="/articles" class="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] text-ink-soft hover:text-cinnabar">
            <van-icon name="arrow-left" size="12" />
            返回兰文
          </NuxtLink>
          <div class="flex items-center gap-4">
            <button
              class="inline-flex items-center gap-2 border border-[#E3DBC9] px-4 py-2 font-song text-[12px] tracking-[0.18em] text-ink-soft transition-colors hover:border-cinnabar hover:text-cinnabar"
              @click="shareOpen = true"
            >
              <van-icon name="share-o" size="12" />
              分享此文
            </button>
            <div class="flex items-center gap-2">
              <span class="seal h-8 w-8 text-[11px]">阅</span>
              <span class="text-[10px] tracking-[0.2em] text-ink-light">开卷有益</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- 上下篇 -->
    <section class="border-t border-[#E3DBC9]/60 bg-paper-light/40 py-8 md:py-10">
      <div class="container grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-if="article.prev"
          :to="`/articles/${article.prev.slug}`"
          class="group border border-[#E3DBC9] bg-paper p-5 transition-colors hover:border-gold"
        >
          <p class="text-[10px] tracking-[0.25em] text-ink-light">上一篇</p>
          <p class="mt-2 line-clamp-1 font-song text-[14px] text-ink transition-colors group-hover:text-cinnabar">
            {{ article.prev.title }}
          </p>
        </NuxtLink>
        <div v-else class="hidden md:block" />

        <NuxtLink
          v-if="article.next"
          :to="`/articles/${article.next.slug}`"
          class="group border border-[#E3DBC9] bg-paper p-5 text-right transition-colors hover:border-gold"
        >
          <p class="text-[10px] tracking-[0.25em] text-ink-light">下一篇</p>
          <p class="mt-2 line-clamp-1 font-song text-[14px] text-ink transition-colors group-hover:text-cinnabar">
            {{ article.next.title }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <!-- 相关 -->
    <section v-if="article.related?.length" class="container py-14">
      <SectionTitle title="相关兰文" en="RELATED ESSAYS" />
      <div class="mt-8 grid gap-8 md:grid-cols-3">
        <ArticleCard v-for="item in article.related" :key="item.id" :article="item" />
      </div>
    </section>

    <ShareSheet
      v-model="shareOpen"
      :title="article.title"
      :desc="article.summary || ''"
      :image="article.cover || ''"
      :path="`/articles/${article.slug}`"
      :tag="article.category"
      label="文"
    />
  </div>
</template>

<script setup>
import { formatDate } from '~/utils/date'

const route = useRoute()

const shareOpen = ref(false)
const { absolute, shareImage } = useShare()

const { data: article, error } = await useFetch(`/api/articles/${route.params.slug}`, {
  key: `article-${route.params.slug}`
})

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在或已下架', fatal: true })
}

const shareImg = computed(() => shareImage(article.value?.cover, 500))

useSeoMeta({
  title: () => article.value?.title || '兰文',
  description: () => article.value?.summary || '',
  ogTitle: () => article.value?.title || '兰文',
  ogDescription: () => article.value?.summary || '',
  ogType: 'article',
  ogUrl: () => absolute(`/articles/${article.value?.slug || ''}`),
  ogImage: () => shareImg.value,
  ogImageWidth: 500,
  ogImageHeight: 281,
  twitterCard: 'summary_large_image',
  articleAuthor: () => [article.value?.author || '蜀杨兰园编辑部'],
  articlePublishedTime: () => (article.value?.publishedAt ? new Date(article.value.publishedAt).toISOString() : '')
})
</script>
