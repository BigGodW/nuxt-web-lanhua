<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="relative mb-6 flex h-16 w-16 items-center justify-center border border-gold/40">
      <span class="font-song text-2xl text-gold/70">兰</span>
      <span class="absolute -right-1 -top-1 h-2 w-2 bg-cinnabar/70" />
    </div>
    <p class="font-song text-[15px] tracking-[0.2em] text-ink-soft">{{ text }}</p>
    <p v-if="hint" class="mt-2 text-[12px] text-ink-light">{{ hint }}</p>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  text: { type: String, default: '此处暂无兰草' },
  hint: { type: String, default: '' }
})
</script>
