<template>
  <div>
    <PageHero
      title="关于九畹"
      en="ABOUT JIU WAN"
      :subtitle="site.slogan ? `${site.slogan}。` : ''"
    />

    <!-- 引言 -->
    <section class="container py-9 md:py-20">
      <div class="grid gap-6 md:grid-cols-[260px_1fr] md:gap-16">
        <div class="relative mx-auto w-full max-w-[240px] md:max-w-none">
          <SmartImage src="https://wubugimg.orchids.com.cn/uploads/banner/202611/20261109-banner-2-ba06a4dd.jpg" alt="九畹兰室" ratio="3 / 4" class="pattern-frame" />
          <div class="mt-4 flex items-center justify-between">
            <span class="text-[10px] tracking-[0.25em] text-gold-deep/70">JIU WAN · 2026</span>
            <span class="seal h-9 w-9 text-[12px]">兰</span>
          </div>
        </div>

        <div>
          <SectionTitle title="九畹之名" en="THE NAME" />
          <p class="mt-4 font-song text-[13.5px] leading-7 text-ink-soft/90 md:mt-5 md:text-[14px] md:leading-8">{{ site.about }}</p>

          <div class="mt-5 border-l-2 border-gold/50 bg-paper-light/60 px-4 py-3.5 font-song text-[12.5px] leading-6 text-ink-soft/80 md:mt-6 md:px-5 md:py-4 md:text-[13px] md:leading-7">
            <p>“余既滋兰之九畹兮，又树蕙之百亩。”</p>
            <p class="mt-1 text-[11px] tracking-[0.2em] text-ink-light">—— 屈原《离骚》</p>
          </div>

          <div class="mt-5 grid grid-cols-3 gap-2.5 border-y border-[#E3DBC9] py-3.5 md:mt-8 md:gap-4 md:py-5">
            <div>
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ site.statYears || '20' }}<span class="ml-1 text-xs">年</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">莳兰经验</p>
            </div>
            <div class="border-x border-[#E3DBC9] pl-4">
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ site.statVarieties || '120' }}<span class="ml-1 text-xs">品</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">收录品种</p>
            </div>
            <div class="pl-4">
              <p class="font-song text-[22px] leading-none text-jade-deep md:text-[26px]">{{ site.statArticles || '80' }}<span class="ml-1 text-xs">篇</span></p>
              <p class="mt-2 text-[10px] tracking-[0.2em] text-ink-light">兰文札记</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 三件事 -->
    <section class="border-y border-[#E3DBC9]/60 bg-paper-light/40 py-10 md:py-16">
      <div class="container">
        <SectionTitle title="我们在做的三件事" en="WHAT WE DO" center />

        <div class="mt-7 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
          <div
            v-for="(item, index) in pillars"
            :key="item.title"
            class="group border border-[#E3DBC9] bg-paper p-5 transition-colors hover:border-gold/60 md:p-6"
          >
            <div class="flex items-center justify-between">
              <span class="font-song text-[11px] tracking-[0.2em] text-gold/80">{{ cnNumber(index) }}</span>
              <van-icon :name="item.icon" size="18" class="text-jade-light" />
            </div>
            <h3 class="mt-4 font-song text-[18px] tracking-[0.12em] text-jade-deep md:mt-6 md:text-[19px] md:tracking-[0.15em]">{{ item.title }}</h3>
            <p class="mt-2.5 text-[12px] leading-6 text-ink-soft/75 md:mt-3 md:leading-7">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系 -->
    <section class="container py-9 md:py-20">
      <div class="grid gap-7 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <SectionTitle title="联络九畹" en="CONTACT" subtitle="品种指正、图文投稿、交流养兰心得，欢迎来信。" />

          <dl class="mt-6 space-y-3 md:mt-8 md:space-y-4">
            <div v-for="item in contacts" :key="item.label" class="flex gap-6 border-b border-[#E3DBC9]/70 pb-3">
              <dt class="w-16 shrink-0 text-[11px] tracking-[0.2em] text-ink-light">{{ item.label }}</dt>
              <dd class="font-song text-[13px] text-jade-deep">{{ item.value || '—' }}</dd>
            </div>
          </dl>
        </div>

        <div class="ink-wash relative overflow-hidden p-6 md:p-10">
          <div class="absolute inset-0 opacity-30 bg-paper-grain" />
          <div class="relative">
            <p class="text-[10px] tracking-[0.4em] text-gold-light/70">兰畹寄语</p>
            <p class="mt-5 font-song text-[18px] leading-[1.9] tracking-[0.12em] text-paper/90 md:mt-6 md:text-[20px] md:leading-[2] md:tracking-[0.14em]">
              养兰如养心，<br />急不得，也躁不得。
            </p>
            <div class="mt-6 flex items-center justify-between md:mt-8">
              <span class="text-[11px] tracking-[0.25em] text-paper/45">{{ site.contactPerson || '九畹编辑部' }}</span>
              <span class="seal h-10 w-10 text-[13px]">九畹</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { cnNumber } from '~/utils/date'

const site = useSite()

const pillars = [
  {
    title: '录品种',
    icon: 'flower-o',
    desc: '以品类为纲，记录春兰、蕙兰、建兰、墨兰、寒兰等名品的瓣型、花期、香气与产地，让每一株兰草都有据可查。'
  },
  {
    title: '记养护',
    icon: 'notes-o',
    desc: '把植料配比、浇水节奏、四季管理写成可操作的札记，让初入兰门的人少走弯路。'
  },
  {
    title: '传文化',
    icon: 'bookmark-o',
    desc: '从《离骚》到兰室清供，整理与兰相关的诗文、器物与生活方式，让兰文化回到日常。'
  }
]

const contacts = computed(() => [
  { label: '联系人', value: site.value.contactPerson },
  { label: '电话', value: site.value.phone },
  { label: '邮箱', value: site.value.email },
  { label: '微信', value: site.value.wechat },
  { label: '地址', value: site.value.address }
])

useHead({
  title: '关于九畹',
  meta: [{ name: 'description', content: site.value.about || '关于九畹国兰清赏' }]
})
</script>
