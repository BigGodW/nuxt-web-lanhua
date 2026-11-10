<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 md:gap-1.5">
    <button
      class="flex h-11 w-11 shrink-0 items-center justify-center border border-[#E3DBC9] text-ink-soft transition-colors disabled:opacity-30 hover:border-gold hover:text-jade-deep md:h-9 md:w-9"
      :disabled="page <= 1"
      aria-label="上一页"
      @click="$emit('change', page - 1)"
    >
      <van-icon name="arrow-left" size="12" />
    </button>

    <!--
      窄屏最多同时出现「首页 + 当前页 + 末页」三个页码，中间页码靠 sm 断点恢复，
      否则 7 个 44px 按钮在 320px 屏幕上会横向溢出。
    -->
    <button
      v-for="item in pages"
      :key="item"
      class="h-10 min-w-[2.5rem] items-center justify-center border px-1.5 font-song text-[13px] transition-colors md:h-9 md:min-w-[2.25rem]"
      :class="[
        item === page
          ? 'border-jade-deep bg-jade-deep text-paper'
          : 'border-[#E3DBC9] text-ink-soft hover:border-gold hover:text-jade-deep',
        pages.length > 3 && item !== page && item !== pages[0] && item !== pages[pages.length - 1]
          ? 'hidden sm:inline-flex'
          : 'inline-flex'
      ]"
      @click="$emit('change', item)"
    >
      {{ item }}
    </button>

    <button
      class="flex h-11 w-11 shrink-0 items-center justify-center border border-[#E3DBC9] text-ink-soft transition-colors disabled:opacity-30 hover:border-gold hover:text-jade-deep md:h-9 md:w-9"
      :disabled="page >= totalPages"
      aria-label="下一页"
      @click="$emit('change', page + 1)"
    >
      <van-icon name="arrow" size="12" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 }
})

defineEmits(['change'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.page
  const size = total <= 5 ? total : 5
  let start = Math.max(1, current - 2)
  if (start + size - 1 > total) start = Math.max(1, total - size + 1)
  return Array.from({ length: size }, (_, index) => start + index)
})
</script>
