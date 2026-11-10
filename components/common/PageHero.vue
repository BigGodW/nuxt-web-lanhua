<template>
  <section class="relative overflow-hidden bg-jade-deep">
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.55]"
      style="background-image: radial-gradient(circle at 78% 20%, rgba(185, 154, 91, 0.22), transparent 45%), radial-gradient(circle at 12% 90%, rgba(92, 122, 107, 0.35), transparent 50%)"
    />
    <div class="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full border border-paper/10" />
    <div class="pointer-events-none absolute -left-8 -top-16 h-40 w-40 rounded-full border border-paper/10" />

    <div class="container relative py-7 md:py-16">
      <div class="flex items-end justify-between gap-8">
        <div>
          <p v-if="en" class="text-[10px] uppercase tracking-[0.42em] text-gold-light/70">{{ en }}</p>
          <h1 class="mt-2 font-song text-[23px] leading-tight tracking-[0.16em] text-paper md:mt-3 md:text-[36px] md:tracking-[0.22em]">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-3 max-w-2xl text-[12.5px] leading-6 text-paper/60 md:mt-4 md:text-[13px] md:leading-7">{{ subtitle }}</p>
          <slot />
        </div>

        <div class="hidden shrink-0 flex-col items-center gap-3 md:flex">
          <span class="h-10 w-px bg-gold/40" />
          <span class="vertical-text font-song text-[13px] text-paper/40">香遠益清</span>
          <span class="h-10 w-px bg-gold/40" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  en: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})
</script>
