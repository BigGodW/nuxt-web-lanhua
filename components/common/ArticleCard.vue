<template>
  <NuxtLink
    :to="`/articles/${article.slug}`"
    class="group block"
    :class="variant === 'list' ? 'flex gap-3 md:gap-4' : ''"
  >
    <template v-if="variant === 'list'">
      <SmartImage
        :src="article.cover"
        :alt="article.title"
        ratio="4 / 3"
        w="200"
        class="w-20 shrink-0 md:w-24"
        img-class="group-hover:scale-105"
      />
      <div class="min-w-0 flex-1">
        <p class="text-[11px] tracking-[0.2em] text-cinnabar/80">{{ article.category }}</p>
        <h3 class="mt-1 line-clamp-2 font-song text-[14px] leading-5 text-ink transition-colors group-hover:text-cinnabar md:text-[15px] md:leading-6">
          {{ article.title }}
        </h3>
        <p class="mt-1 text-[11px] text-ink-light">{{ formatDate(article.publishedAt) }}</p>
      </div>
    </template>

    <template v-else>
      <SmartImage :src="article.cover" :alt="article.title" ratio="16 / 10" w="480" img-class="group-hover:scale-[1.03]">
        <span class="absolute left-3 top-3 bg-jade-deep/80 px-2 py-0.5 text-[11px] tracking-[0.18em] text-paper/90">
          {{ article.category }}
        </span>
      </SmartImage>

      <div class="pt-3 md:pt-4">
        <div class="flex items-center gap-2 text-[11px] tracking-[0.15em] text-ink-light">
          <span>{{ formatDate(article.publishedAt) }}</span>
          <span class="h-2 w-px bg-gold/50" />
          <span>{{ article.author }}</span>
        </div>
        <h3 class="mt-1.5 line-clamp-2 font-song text-[16px] leading-6 tracking-wide md:mt-2 md:leading-7 text-ink transition-colors group-hover:text-cinnabar md:text-[17px]">
          {{ article.title }}
        </h3>
        <p v-if="article.summary" class="mt-1.5 line-clamp-2 text-[12px] leading-5 text-ink-soft/70 md:mt-2 md:text-[13px] md:leading-6">
          {{ article.summary }}
        </p>
      </div>
    </template>
  </NuxtLink>
</template>

<script setup>
import { formatDate } from '~/utils/date'

defineProps({
  article: { type: Object, required: true },
  variant: { type: String, default: 'card' }
})
</script>
