<template>
  <footer class="relative mt-12 overflow-hidden bg-jade-deep text-paper/70 md:mt-24">
    <span
      class="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 font-song text-[220px] leading-none text-paper/[0.04] md:block"
    >
      兰
    </span>

    <!-- 移动端：紧凑排布（pb 由 .footer-tabbar-space 兜住底部标签栏） -->
    <div class="container relative pt-7 footer-tabbar-space md:py-16">
      <div class="grid gap-4 md:grid-cols-[1.5fr_1fr_1.2fr] md:gap-10">
        <!-- 品牌 -->
        <div>
          <div class="flex items-center gap-2.5 md:gap-3">
            <span class="seal h-9 w-9 text-sm md:h-11 md:w-11 md:text-lg">兰</span>
            <div>
              <p class="font-song text-lg tracking-[0.22em] text-paper md:text-2xl md:tracking-[0.28em]">
                {{ site.siteName || '蜀杨兰园' }}
              </p>
              <p class="mt-0.5 text-[9px] tracking-[0.3em] text-gold-light/60 md:mt-1">GUOLAN · ORCHID</p>
            </div>
          </div>
          <p
            class="mt-2.5 line-clamp-2 max-w-sm font-song text-[12px] leading-6 text-paper/50 md:mt-5 md:line-clamp-none md:text-[13px] md:leading-7 md:text-paper/55"
          >
            {{ site.slogan || '一茎一花，香远益清' }}。整理国兰名品谱系，记录瓣型、花期、香气与养护，也收录与兰相关的文化与生活。
          </p>
        </div>

        <!-- 导览：手机横向一排，桌面竖排 -->
        <div>
          <p class="hidden font-song text-sm tracking-[0.25em] text-paper/90 md:block">园中导览</p>
          <div
            class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] md:mt-4 md:flex-col md:items-start md:gap-2.5 md:text-[13px]"
          >
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="transition-colors hover:text-gold-light">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- 联络：仅桌面显示，手机端压成下方一行 -->
        <div class="hidden md:block">
          <p class="font-song text-sm tracking-[0.25em] text-paper/90">联络蜀杨兰园</p>
          <div class="mt-4 space-y-2 text-[13px] leading-6">
            <p v-if="site.phone">电话　{{ site.phone }}</p>
            <p v-if="site.email">邮箱　{{ site.email }}</p>
            <p v-if="site.wechat">微信　{{ site.wechat }}</p>
            <p v-if="site.address">地址　{{ site.address }}</p>
          </div>
        </div>
      </div>

      <!-- 手机端联络：一行内以点分隔，不占额外版块 -->
      <p v-if="contactLine.length" class="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-paper/45 md:hidden">
        <template v-for="(line, index) in contactLine" :key="index">
          <span class="max-w-full truncate">{{ line }}</span>
          <span v-if="index < contactLine.length - 1" class="text-paper/20">·</span>
        </template>
      </p>

      <div
        class="mt-3.5 flex flex-col gap-1 border-t border-paper/10 pt-3.5 text-[10.5px] text-paper/40 md:mt-12 md:flex-row md:items-center md:justify-between md:gap-2 md:pt-6 md:text-[11px]"
      >
        <p>{{ site.copyright || '© 2026 蜀杨兰园 · 国兰清赏' }}</p>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span v-if="site.icp">{{ site.icp }}</span>
          <span v-if="site.footerNote" class="hidden text-paper/30 md:inline">{{ site.footerNote }}</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const site = useSite()

const nav = [
  { label: '兰谱总览', to: '/orchids' },
  { label: '国兰品类', to: '/categories' },
  { label: '兰文共赏', to: '/articles' },
  { label: '关于蜀杨兰园', to: '/about' },
  { label: '管理后台', to: '/admin' }
]

// 手机端联络信息合并成一行，按有值才显示
// 注意：useState 在 script 里是 ref，取值必须 .value
const contactLine = computed(() => {
  const info = site.value || {}
  return [
    info.phone ? `电话 ${info.phone}` : '',
    info.wechat ? `微信 ${info.wechat}` : '',
    info.email ? `邮箱 ${info.email}` : '',
    info.address ? `地址 ${info.address}` : ''
  ].filter(Boolean)
})
</script>
