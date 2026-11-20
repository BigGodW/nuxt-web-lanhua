<template>
  <!-- 移动端：单行横向滑动，不换行、不占多屏高度；桌面端：自动换行平铺 -->
  <div v-if="tags?.length" class="no-scrollbar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1 md:flex-wrap md:gap-2 md:overflow-visible md:pb-0">
    <span class="mr-0.5 shrink-0 font-song text-[12px] tracking-[0.2em] text-ink-light">标签</span>
    <NuxtLink
      v-for="tag in tags"
      :key="tag.id"
      :to="tagQuery(tag.slug)"
      class="shrink-0 whitespace-nowrap border px-2.5 py-1 text-[11.5px] transition-colors md:px-3 md:text-[12px]"
      :class="
        active === tag.slug
          ? 'border-cinnabar bg-cinnabar text-paper'
          : 'border-[#E3DBC9] text-ink-soft hover:border-gold hover:text-jade-deep'
      "
    >
      # {{ tag.name }}
      <span class="ml-0.5 hidden text-[10px] opacity-60 md:inline">{{ tag._count[countKey] }}</span>
    </NuxtLink>
    <NuxtLink v-if="active" :to="basePath" class="shrink-0 whitespace-nowrap pl-1 text-[11px] text-cinnabar/80 hover:text-cinnabar">
      清除筛选 ×
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  tags: { type: Array, default: () => [] },
  /** 当前选中的标签 slug（空表示未筛选） */
  active: { type: String, default: '' },
  /** 数量角标取 _count 里的字段名：orchids / articles */
  countKey: { type: String, required: true },
  /** 清除筛选与标签跳转的目标路径 */
  basePath: { type: String, required: true }
})

const route = useRoute()

/** 保留当前品类 / 关键词等查询参数，只切换标签 */
function tagQuery(slug) {
  const query = { ...route.query, tag: slug, page: undefined }
  Object.keys(query).forEach((key) => {
    if (!query[key]) delete query[key]
  })
  return { path: props.basePath, query }
}
</script>
