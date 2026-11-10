<template>
  <!-- 移动端底部标签栏：md 以上隐藏，桌面沿用顶部导航 -->
  <nav
    class="tabbar fixed inset-x-0 bottom-0 z-40 border-t border-[#E3DBC9]/80 bg-paper/95 backdrop-blur-md md:hidden"
    aria-label="主导航"
  >
    <div class="tabbar-inner flex items-stretch">
      <NuxtLink
        v-for="item in tabs"
        :key="item.to"
        :to="item.to"
        class="relative flex flex-1 flex-col items-center justify-center gap-[5px] pb-1.5 pt-2 transition-colors active:bg-paper-deep/70"
        :class="isActive(item.to) ? 'text-cinnabar' : 'text-ink-soft/70'"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        @click="onTap(item)"
      >
        <span
          class="absolute inset-x-[30%] top-0 h-[2px] origin-center rounded-full bg-cinnabar transition-all duration-300"
          :class="isActive(item.to) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'"
        />
        <van-icon :name="item.icon" size="19" />
        <span class="font-song text-[10.5px] leading-none tracking-[0.1em]">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const tabs = [
  { label: '首页', to: '/', icon: 'home-o' },
  { label: '兰谱', to: '/orchids', icon: 'flower-o' },
  { label: '品类', to: '/categories', icon: 'apps-o' },
  { label: '兰文', to: '/articles', icon: 'notes-o' },
  { label: '关于', to: '/about', icon: 'info-o' }
]

function isActive(to) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

// 已在当前标签页时，再点一次回到顶部（移动端长页面常用手势）
function onTap(item) {
  if (!import.meta.client) return
  if (route.path === item.to) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
