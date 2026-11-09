<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5">
    <button
      class="flex h-9 w-9 items-center justify-center border border-[#E3DBC9] text-ink-soft transition-colors disabled:opacity-30 hover:border-gold hover:text-jade-deep"
      :disabled="page <= 1"
      aria-label="上一页"
      @click="$emit('change', page - 1)"
    >
      <van-icon name="arrow-left" size="12" />
    </button>

    <button
      v-for="item in pages"
      :key="item"
      class="h-9 min-w-9 border px-2 font-song text-[13px] transition-colors"
      :class="
        item === page
          ? 'border-jade-deep bg-jade-deep text-paper'
          : 'border-[#E3DBC9] text-ink-soft hover:border-gold hover:text-jade-deep'
      "
      @click="$emit('change', item)"
    >
      {{ item }}
    </button>

    <button
      class="flex h-9 w-9 items-center justify-center border border-[#E3DBC9] text-ink-soft transition-colors disabled:opacity-30 hover:border-gold hover:text-jade-deep"
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
