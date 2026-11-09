<template>
  <div :class="center ? 'text-center' : ''">
    <div class="flex items-end gap-3" :class="center ? 'justify-center' : ''">
      <span class="seal mb-1 h-8 w-8 shrink-0 text-[13px]">兰</span>
      <div>
        <p v-if="en" class="text-[10px] uppercase tracking-[0.38em] text-gold">{{ en }}</p>
        <h2 class="mt-1 font-song text-[22px] leading-tight tracking-[0.14em] text-jade-deep md:text-[28px]">
          {{ title }}
        </h2>
      </div>
    </div>

    <div class="mt-4 flex items-center gap-3" :class="center ? 'justify-center' : ''">
      <span class="h-px w-10 bg-gold/60" />
      <p v-if="subtitle" class="max-w-2xl text-[13px] leading-7 text-ink-soft/75">{{ subtitle }}</p>
      <span v-if="center && subtitle" class="h-px w-10 bg-gold/60" />
    </div>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  en: { type: String, default: '' },
  center: { type: Boolean, default: false }
})
</script>
