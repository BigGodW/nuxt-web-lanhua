<template>
  <div class="relative overflow-hidden bg-paper-deep/70" :style="{ aspectRatio: ratio }">
    <img
      v-if="src && !failed"
      :src="url"
      :alt="alt"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      :decoding="priority ? 'sync' : 'async'"
      class="h-full w-full object-cover transition-transform duration-700 ease-out"
      :class="imgClass"
      @error="failed = true"
    />

    <!-- 图片缺失时的水墨兜底 -->
    <div
      v-else
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-jade-deep via-jade to-jade-light"
    >
      <div class="absolute inset-0 opacity-30 bg-paper-grain" />
      <div class="relative flex flex-col items-center gap-2 text-paper/70">
        <span class="font-song text-4xl tracking-seal">兰</span>
        <span class="text-[10px] tracking-[0.3em] text-paper/50">九畹</span>
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  ratio: { type: String, default: '4 / 5' },
  imgClass: { type: String, default: '' },
  // 期望的显示宽度（px），CDN 图片会按此宽度裁剪，避免下载原图
  // 兼容两种写法：:w="200" 与 w="200"（页面里字符串更常见）
  w: { type: [Number, String], default: 0 },
  // 首屏图片设为 true：立即加载 + 高优先级，其余保持懒加载
  priority: { type: Boolean, default: false }
})

const { img } = useImage()

const failed = ref(false)
const width = computed(() => Number(props.w) || 0)
const url = computed(() => img(props.src, width.value))

watch(
  () => props.src,
  () => {
    failed.value = false
  }
)
</script>
