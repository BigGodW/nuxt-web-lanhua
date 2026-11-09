<template>
  <section class="border border-[#E3DBC9] bg-paper-light">
    <header v-if="title" class="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3DBC9] px-5 py-4">
      <div class="flex items-center gap-2.5">
        <span class="h-3.5 w-px bg-cinnabar" />
        <h2 class="font-song text-[15px] tracking-[0.12em] text-jade-deep">{{ title }}</h2>
        <span v-if="hint" class="text-[11px] text-ink-light">{{ hint }}</span>
      </div>
      <slot name="action" />
    </header>
    <div :class="bodyClass">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  hint: { type: String, default: '' },
  bodyClass: { type: String, default: 'p-5' }
})
</script>
