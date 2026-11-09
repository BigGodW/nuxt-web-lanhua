<template>
  <NuxtLink :to="`/orchids/${orchid.slug}`" class="group block">
    <div class="border border-[#E7DFCD] bg-paper-light/60 p-2 transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-card">
      <SmartImage :src="orchid.cover" :alt="orchid.name" ratio="4 / 5" w="440" img-class="group-hover:scale-[1.04]">
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-jade-deep/70 via-jade-deep/5 to-transparent" />

        <span
          v-if="orchid.category"
          class="absolute left-3 top-3 bg-paper/85 px-2 py-0.5 font-song text-[11px] tracking-[0.2em] text-jade-deep backdrop-blur-sm"
        >
          {{ orchid.category.name }}
        </span>

        <div class="absolute inset-x-3 bottom-3 flex items-end justify-between text-paper">
          <div>
            <p class="font-song text-xl leading-tight tracking-[0.16em]">{{ orchid.name }}</p>
            <p v-if="orchid.alias" class="mt-0.5 text-[11px] tracking-wider text-paper/70">{{ orchid.alias }}</p>
          </div>
          <span v-if="orchid.flowering" class="mb-0.5 text-[10px] tracking-[0.15em] text-paper/70">
            {{ orchid.flowering }}
          </span>
        </div>
      </SmartImage>
    </div>

    <p v-if="orchid.summary" class="mt-3 line-clamp-2 text-[13px] leading-6 text-ink-soft/75">
      {{ orchid.summary }}
    </p>

    <div v-if="orchid.tags?.length" class="mt-2 flex flex-wrap gap-x-3 gap-y-1">
      <span v-for="tag in orchid.tags.slice(0, 3)" :key="tag" class="text-[11px] text-gold-deep/70">
        · {{ tag }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  orchid: { type: Object, required: true }
})
</script>
