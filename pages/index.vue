<template>
  <div>
    <HomeHero :banners="home?.banners || []" />

    <!-- 卷首语 -->
    <section class="border-b border-[#E3DBC9]/70 bg-paper">
      <div class="container py-7 text-center md:py-12">
        <p class="font-song text-[12.5px] leading-7 tracking-[0.18em] text-ink-soft/80 md:text-[15px] md:leading-8 md:tracking-[0.22em]">
          余既滋兰之九畹兮，又树蕙之百亩
        </p>
        <p class="mt-2 text-[10px] tracking-[0.4em] text-gold-deep/60">屈原 · 离骚</p>
      </div>
    </section>

    <!-- 品类 -->
    <section class="container py-9 md:py-20">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionTitle
          title="国兰品类"
          en="CATEGORIES OF CHINESE ORCHID"
          subtitle="春兰一茎一花，蕙兰一茎九花，建兰夏秋吐芳，墨兰报岁迎春，寒兰傲霜而开。"
        />
        <NuxtLink to="/categories" class="group flex items-center gap-2 text-[12px] tracking-[0.2em] text-ink-soft hover:text-cinnabar">
          全部品类
          <van-icon name="arrow" size="12" class="transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>

      <div class="mt-7 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
        <NuxtLink
          v-for="(category, index) in home?.categories || []"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group relative flex min-h-[126px] flex-col justify-between border border-[#E3DBC9] bg-paper-light/50 p-3.5 transition-all md:min-h-[168px] md:p-5 duration-500 hover:-translate-y-1 hover:border-gold/60 hover:bg-paper-light hover:shadow-card"
        >
          <span class="font-song text-[11px] tracking-[0.2em] text-gold/80">{{ cnNumber(index) }}</span>
          <div class="mt-3 md:mt-4">
            <p class="font-song text-[18px] leading-tight tracking-[0.14em] md:text-[22px] md:tracking-[0.2em] text-jade-deep">{{ category.name }}</p>
            <p class="mt-1.5 line-clamp-1 text-[11px] tracking-wide text-ink-light">{{ category.subtitle }}</p>
          </div>
          <div class="mt-2.5 flex items-center justify-between text-[11px] text-ink-light md:mt-4">
            <span>{{ category._count?.orchids || 0 }} 品</span>
            <van-icon name="arrow" size="11" class="text-gold/60 transition-transform group-hover:translate-x-1" />
          </div>
        </NuxtLink>

        <NuxtLink
          to="/orchids"
          class="group flex min-h-[126px] flex-col justify-between bg-jade-deep p-3.5 text-paper transition-colors md:min-h-[168px] md:p-5 hover:bg-jade"
        >
          <span class="text-[10px] tracking-[0.3em] text-gold-light/70">ALL</span>
          <div class="mt-3 md:mt-4">
            <p class="font-song text-[18px] leading-tight tracking-[0.14em] md:text-[22px] md:tracking-[0.2em]">兰谱总览</p>
            <p class="mt-1.5 text-[11px] tracking-wide text-paper/50">共 {{ home?.stats?.orchids || 0 }} 个品种</p>
          </div>
          <div class="mt-2.5 flex items-center justify-between text-[11px] text-paper/60 md:mt-4">
            <span>按品类检索</span>
            <van-icon name="arrow" size="11" class="transition-transform group-hover:translate-x-1" />
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- 精选品种 -->
    <section class="border-y border-[#E3DBC9]/60 bg-paper-light/40 py-9 md:py-20">
      <div class="container">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <SectionTitle
            title="案头清供"
            en="SELECTED ORCHIDS"
            subtitle="梅瓣之厚糯，荷瓣之端庄，水仙之秀逸，蝶花之奇变。择其名品，与君共赏。"
          />
          <NuxtLink to="/orchids" class="group flex items-center gap-2 text-[12px] tracking-[0.2em] text-ink-soft hover:text-cinnabar">
            浏览全部
            <van-icon name="arrow" size="12" class="transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div v-if="home?.featured?.length" class="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-10 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
          <OrchidCard v-for="orchid in home.featured" :key="orchid.id" :orchid="orchid" />
        </div>
        <EmptyState v-else text="兰谱正在整理中" hint="请稍后再来，或在管理后台添加品种" />
      </div>
    </section>

    <!-- 水墨引言 -->
    <section class="relative overflow-hidden bg-jade-deep py-10 text-paper md:py-14 lg:py-20">
      <div class="absolute inset-0 opacity-30 bg-paper-grain" />
      <span class="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 font-song text-[180px] leading-none text-paper/[0.04]">
        蘭
      </span>
      <div class="container relative flex flex-col items-center text-center">
        <span class="seal h-10 w-10 text-lg md:h-12 md:w-12 md:text-xl">兰</span>
        <p class="mt-5 max-w-2xl font-song text-[18px] leading-[1.9] tracking-[0.14em] text-paper/90 md:mt-7 md:text-[26px] md:leading-[2] md:tracking-[0.18em]">
          芝兰生于深林，不以无人而不芳
        </p>
        <div class="mt-5 flex items-center gap-3 text-[10px] tracking-[0.35em] text-gold-light/60">
          <span class="h-px w-8 bg-gold/40" />
          君子修道立德，不为穷困而改节
          <span class="h-px w-8 bg-gold/40" />
        </div>
      </div>
    </section>

    <!-- 兰文 -->
    <section class="container py-9 md:py-20">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <SectionTitle
          title="兰文共赏"
          en="ESSAYS & NOTES"
          subtitle="瓣型鉴赏、四季养护、兰室清供，记录与兰相处的方式。"
        />
        <NuxtLink to="/articles" class="group flex items-center gap-2 text-[12px] tracking-[0.2em] text-ink-soft hover:text-cinnabar">
          全部文章
          <van-icon name="arrow" size="12" class="transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>

      <div v-if="home?.articles?.length" class="mt-7 grid gap-7 md:gap-10 lg:grid-cols-[1.15fr_1fr]">
        <ArticleCard v-if="home.articles[0]" :article="home.articles[0]" />

        <div class="flex flex-col">
          <div class="flex-1 divide-y divide-[#E3DBC9]/70">
            <div v-for="article in home.articles.slice(1)" :key="article.id" class="py-4 first:pt-0 md:py-5">
              <ArticleCard :article="article" variant="list" />
            </div>
          </div>

          <NuxtLink
            to="/articles"
            class="mt-5 flex items-center justify-between border border-[#E3DBC9] px-4 py-3 text-[12px] md:mt-6 md:px-5 md:py-4 tracking-[0.2em] text-ink-soft transition-colors hover:border-gold hover:text-jade-deep"
          >
            更多兰文
            <van-icon name="arrow" size="12" />
          </NuxtLink>
        </div>
      </div>
      <EmptyState v-else text="暂无文章" hint="可在后台「文章管理」中撰写第一篇兰文" />
    </section>

    <!-- 关于 -->
    <section class="border-t border-[#E3DBC9]/60 bg-paper-light/50 py-9 md:py-20">
      <div class="container grid items-center gap-7 md:grid-cols-2 md:gap-16">
        <div class="relative">
          <SmartImage src="https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-2-ba06a4dd.jpg" alt="九畹兰室" ratio="4 / 3" class="pattern-frame">
            <div class="absolute inset-0 bg-jade-deep/10" />
          </SmartImage>
          <div class="absolute -bottom-5 -right-4 hidden bg-paper px-5 py-3 shadow-card md:block">
            <p class="font-song text-[11px] tracking-[0.2em] text-gold-deep">兰畹手记</p>
          </div>
        </div>

        <div>
          <SectionTitle
            title="关于九畹"
            en="ABOUT JIU WAN"
            subtitle="九畹之名，取自屈原《离骚》。这里记录国兰的品种谱系与瓣型之美，也记录养兰人的日常。"
          />

          <p class="mt-4 line-clamp-4 text-[12.5px] leading-6 text-ink-soft/80 md:mt-5 md:text-[13px] md:leading-7">
            {{ site.about }}
          </p>

          <div class="mt-5 grid grid-cols-3 gap-2.5 border-y border-[#E3DBC9] py-3.5 md:mt-8 md:gap-4 md:py-5">
            <div>
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ site.statYears || '20' }}<span class="ml-1 text-xs">年</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">莳兰经验</p>
            </div>
            <div class="border-x border-[#E3DBC9] pl-4">
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ home?.stats?.orchids || 0 }}<span class="ml-1 text-xs">品</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">在录品种</p>
            </div>
            <div class="pl-4">
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ home?.stats?.articles || 0 }}<span class="ml-1 text-xs">篇</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">兰文札记</p>
            </div>
          </div>

          <NuxtLink
            to="/about"
            class="group mt-6 inline-flex items-center gap-2 border border-jade-deep/30 px-5 py-2.5 md:mt-8 md:px-6 md:py-3 font-song text-[13px] tracking-[0.2em] text-jade-deep transition-colors hover:border-jade-deep hover:bg-jade-deep hover:text-paper"
          >
            走进九畹
            <van-icon name="arrow" size="12" class="transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { cnNumber } from '~/utils/date'

const site = useSite()

const { data: home } = await useFetch('/api/home', { key: 'home-data' })

useHead({ title: '国兰清赏' })
</script>
