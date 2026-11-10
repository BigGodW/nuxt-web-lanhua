<template>
  <div :class="center ? 'text-center' : ''">
    <div class="flex items-end gap-3" :class="center ? 'justify-center' : ''">
      <span class="seal h-7 w-7 shrink-0 text-[12px] md:mb-1 md:h-8 md:w-8 md:text-[13px]">兰</span>
      <div>
        <p v-if="en" class="text-[10px] uppercase tracking-[0.38em] text-gold">{{ en }}</p>
        <h2 class="mt-0.5 font-song text-[19px] leading-tight tracking-[0.1em] text-jade-deep md:mt-1 md:text-[28px] md:tracking-[0.14em]">
          {{ title }}
        </h2>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-3 md:mt-4" :class="center ? 'justify-center' : ''">
      <span class="h-px w-8 shrink-0 bg-gold/60 md:w-10" />
      <p v-if="subtitle" class="min-w-0 max-w-2xl text-[12px] leading-6 text-ink-soft/75 md:text-[13px] md:leading-7">{{ subtitle }}</p>
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
