<template>
  <nav class="flex flex-col gap-1">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="group flex items-center gap-3 px-4 py-3 text-[13px] tracking-[0.08em] transition-colors"
      :class="
        isActive(item.to)
          ? 'bg-paper/[0.08] text-paper'
          : 'text-paper/50 hover:bg-paper/[0.04] hover:text-paper/80'
      "
      @click="$emit('navigate')"
    >
      <span class="h-3.5 w-px transition-colors" :class="isActive(item.to) ? 'bg-cinnabar' : 'bg-transparent'" />
      <van-icon :name="item.icon" size="15" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
defineEmits(['navigate'])

const route = useRoute()

const items = [
  { label: '仪表盘', to: '/admin', icon: 'wap-home-o' },
  { label: '品种管理', to: '/admin/orchids', icon: 'flower-o' },
  { label: '品类管理', to: '/admin/categories', icon: 'apps-o' },
  { label: '文章管理', to: '/admin/articles', icon: 'notes-o' },
  { label: '轮播管理', to: '/admin/banners', icon: 'photo-o' },
  { label: '站点设置', to: '/admin/settings', icon: 'setting-o' }
]

function isActive(to) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}
</script>
