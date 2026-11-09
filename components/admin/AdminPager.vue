<template>
  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[#E3DBC9] px-4 py-3 text-[11px] text-ink-light">
    <span>共 {{ total }} 条 · 第 {{ page }} / {{ totalPages }} 页</span>
    <div class="flex items-center gap-2">
      <button class="admin-btn-ghost" :disabled="page <= 1" @click="$emit('change', page - 1)">上一页</button>
      <button class="admin-btn-ghost" :disabled="page >= totalPages" @click="$emit('change', page + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  total: { type: Number, default: 0 }
})

defineEmits(['change'])
</script>
