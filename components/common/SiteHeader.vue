<template>
  <header class="sticky top-0 z-40">
    <!-- 顶部小字栏 -->
    <div class="hidden bg-jade-deep md:block">
      <div class="container flex h-8 items-center justify-between text-[11px] tracking-[0.25em] text-paper/65">
        <span class="font-song">{{ site.slogan || '一茎一花，香远益清' }}</span>
        <div class="flex items-center gap-5">
          <span class="text-paper/40">国兰清赏 · 九畹</span>
          <NuxtLink to="/admin" class="transition-colors hover:text-gold-light">管理后台</NuxtLink>
        </div>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="border-b border-[#E3DBC9]/70 bg-paper/90 backdrop-blur-md">
      <div class="container flex h-16 items-center justify-between md:h-20">
        <NuxtLink to="/" class="flex items-center gap-3">
          <span class="seal h-10 w-10 text-base md:h-11 md:w-11 md:text-lg">兰</span>
          <span class="leading-none">
            <span class="block font-song text-xl tracking-[0.3em] text-jade-deep md:text-2xl">
              {{ site.siteName || '九畹' }}
            </span>
            <span class="mt-1.5 block text-[9px] tracking-[0.32em] text-gold-deep/70">GUOLAN · ORCHID</span>
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-9 md:flex">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="group relative py-2 font-song text-[15px] tracking-[0.16em] transition-colors"
            :class="isActive(item.to) ? 'text-cinnabar' : 'text-ink-soft hover:text-jade-deep'"
          >
            {{ item.label }}
            <span
              class="absolute -bottom-0.5 left-0 h-px bg-cinnabar transition-all duration-300"
              :class="isActive(item.to) ? 'w-full' : 'w-0 group-hover:w-full'"
            />
          </NuxtLink>
        </nav>

        <button
          class="flex h-9 w-9 items-center justify-center border border-gold/40 text-jade-deep md:hidden"
          aria-label="打开菜单"
          @click="menuOpen = true"
        >
          <van-icon name="bars" size="18" />
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <van-popup
      v-model:show="menuOpen"
      position="right"
      :style="{ width: '76%', height: '100%' }"
      class="bg-paper"
    >
      <div class="flex h-full flex-col px-7 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="seal h-10 w-10 text-base">兰</span>
            <div>
              <p class="font-song text-lg tracking-[0.25em] text-jade-deep">{{ site.siteName || '九畹' }}</p>
              <p class="mt-1 text-[9px] tracking-[0.3em] text-gold-deep/70">GUOLAN · ORCHID</p>
            </div>
          </div>
          <button class="text-ink-light" aria-label="关闭菜单" @click="menuOpen = false">
            <van-icon name="cross" size="20" />
          </button>
        </div>

        <div class="hairline my-6" />

        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="flex items-center justify-between border-b border-[#E3DBC9]/60 py-4 font-song text-[17px] tracking-[0.2em]"
            :class="isActive(item.to) ? 'text-cinnabar' : 'text-ink'"
            @click="menuOpen = false"
          >
            {{ item.label }}
            <van-icon name="arrow" size="14" class="text-gold/70" />
          </NuxtLink>
        </nav>

        <div class="mt-auto space-y-2 text-[11px] leading-6 text-ink-light">
          <p>{{ site.slogan }}</p>
          <p>{{ site.phone }}</p>
          <NuxtLink to="/admin" class="inline-block text-cinnabar/80" @click="menuOpen = false">进入管理后台</NuxtLink>
        </div>
      </div>
    </van-popup>
  </header>
</template>

<script setup>
const site = useSite()
const route = useRoute()
const menuOpen = ref(false)

const nav = [
  { label: '首页', to: '/' },
  { label: '兰谱', to: '/orchids' },
  { label: '品类', to: '/categories' },
  { label: '兰文', to: '/articles' },
  { label: '关于', to: '/about' }
]

function isActive(to) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  }
)
</script>
