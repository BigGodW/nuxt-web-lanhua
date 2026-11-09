<template>
  <div>
    <PageHero
      title="品类"
      en="CATEGORIES"
      subtitle="春兰、蕙兰、建兰、墨兰、寒兰、春剑、莲瓣兰——七大品类，各有法度。"
    />

    <section class="container py-12 md:py-16">
      <div class="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
        <NuxtLink
          v-for="(category, index) in categories || []"
          :key="category.id"
          :to="`/categories/${category.slug}`"
          class="group block"
        >
          <SmartImage :src="category.cover" :alt="category.name" ratio="16 / 10" w="520" img-class="group-hover:scale-[1.03]">
            <div class="absolute inset-0 bg-gradient-to-t from-jade-deep/80 via-jade-deep/20 to-transparent" />
            <span class="absolute left-4 top-4 font-song text-[12px] tracking-[0.25em] text-paper/70">
              {{ cnNumber(index) }}
            </span>
            <div class="absolute inset-x-5 bottom-4 flex items-end justify-between">
              <div>
                <p class="font-song text-[26px] tracking-[0.2em] text-paper">{{ category.name }}</p>
                <p class="mt-1 text-[11px] tracking-[0.15em] text-paper/65">{{ category.subtitle }}</p>
              </div>
              <span class="border border-paper/40 px-2 py-0.5 text-[10px] tracking-[0.1em] text-paper/80">
                {{ category._count?.orchids || 0 }} 品
              </span>
            </div>
          </SmartImage>

          <p class="mt-4 line-clamp-2 text-[13px] leading-7 text-ink-soft/75">
            {{ category.description }}
          </p>

          <span class="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-gold-deep transition-colors group-hover:text-cinnabar">
            进入品类
            <van-icon name="arrow" size="10" class="transition-transform group-hover:translate-x-1" />
          </span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { cnNumber } from '~/utils/date'

const { data: categories } = await useFetch('/api/categories', { key: 'categories-page' })

useHead({
  title: '国兰品类',
  meta: [{ name: 'description', content: '春兰、蕙兰、建兰、墨兰、寒兰、春剑、莲瓣兰——国兰七大品类介绍。' }]
})
</script>
