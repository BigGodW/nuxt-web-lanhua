<template>
  <footer class="relative mt-24 overflow-hidden bg-jade-deep text-paper/70">
    <span
      class="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 font-song text-[220px] leading-none text-paper/[0.04]"
    >
      兰
    </span>

    <div class="container relative py-14 md:py-16">
      <div class="grid gap-10 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <div class="flex items-center gap-3">
            <span class="seal h-11 w-11 text-lg">兰</span>
            <div>
              <p class="font-song text-2xl tracking-[0.28em] text-paper">{{ site.siteName || '九畹' }}</p>
              <p class="mt-1 text-[9px] tracking-[0.34em] text-gold-light/60">GUOLAN · ORCHID</p>
            </div>
          </div>
          <p class="mt-5 max-w-sm font-song text-[13px] leading-7 text-paper/55">
            {{ site.slogan || '一茎一花，香远益清' }}。整理国兰名品谱系，记录瓣型、花期、香气与养护，也收录与兰相关的文化与生活。
          </p>
        </div>

        <div>
          <p class="font-song text-sm tracking-[0.25em] text-paper/90">园中导览</p>
          <div class="mt-4 flex flex-col gap-2.5 text-[13px]">
            <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="transition-colors hover:text-gold-light">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>

        <div>
          <p class="font-song text-sm tracking-[0.25em] text-paper/90">联络九畹</p>
          <div class="mt-4 space-y-2 text-[13px] leading-6">
            <p v-if="site.phone">电话　{{ site.phone }}</p>
            <p v-if="site.email">邮箱　{{ site.email }}</p>
            <p v-if="site.wechat">微信　{{ site.wechat }}</p>
            <p v-if="site.address">地址　{{ site.address }}</p>
          </div>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-2 border-t border-paper/10 pt-6 text-[11px] text-paper/40 md:flex-row md:items-center md:justify-between">
        <p>{{ site.copyright || '© 2026 九畹 · 国兰清赏' }}</p>
        <p class="flex flex-wrap items-center gap-4">
          <span v-if="site.icp">{{ site.icp }}</span>
          <span class="text-paper/30">{{ site.footerNote }}</span>
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
  { label: '关于九畹', to: '/about' },
  { label: '管理后台', to: '/admin' }
]
</script>
