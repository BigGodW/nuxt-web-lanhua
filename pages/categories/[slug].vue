<template>
  <div v-if="category">
    <PageHero :title="category.name" en="ORCHID CATEGORY" :subtitle="category.subtitle || ''">
      <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.12em] text-paper/50 md:mt-5">
        <NuxtLink to="/categories" class="transition-colors hover:text-gold-light">全部品类</NuxtLink>
        <span class="text-gold/50">/</span>
        <span class="text-paper/80">{{ category.name }}</span>
        <span class="ml-2 border border-paper/20 px-2 py-0.5">{{ category._count?.orchids || 0 }} 个品种</span>
      </div>
    </PageHero>

    <section class="container py-8 md:py-16">
      <!-- 品类简介 -->
      <div class="grid gap-6 border-b border-[#E3DBC9]/70 pb-7 md:grid-cols-[1fr_320px] md:gap-16 md:pb-10">
        <div>
          <div class="flex items-center gap-3">
            <span class="seal h-8 w-8 text-[12px]">品</span>
            <p class="font-song text-[15px] tracking-[0.2em] text-jade-deep">品类小识</p>
          </div>
          <p class="mt-3 font-song text-[13.5px] leading-7 text-ink-soft/90 md:mt-4 md:text-[14px] md:leading-8">
            {{ category.description || '该品类的介绍正在整理中。' }}
          </p>
        </div>

        <div v-if="category.orchids?.length" class="border border-[#E3DBC9] bg-paper-light/60 p-4">
          <p class="text-[10px] tracking-[0.25em] text-gold-deep/70">本类名品</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <NuxtLink
              v-for="item in category.orchids.slice(0, 6)"
              :key="item.id"
              :to="`/orchids/${item.slug}`"
              class="border border-[#E3DBC9] px-2.5 py-1 font-song text-[12px] text-ink-soft transition-colors hover:border-gold hover:text-cinnabar"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 品种列表 -->
      <div class="mt-7 md:mt-10">
        <div class="flex items-end justify-between">
          <SectionTitle :title="`${category.name}名品`" en="VARIETIES" />
          <NuxtLink to="/orchids" class="text-[11px] tracking-[0.2em] text-ink-light hover:text-cinnabar">
            查看全部兰谱
          </NuxtLink>
        </div>

        <div v-if="category.orchids?.length" class="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-8 md:gap-x-6 md:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          <OrchidCard v-for="orchid in category.orchids" :key="orchid.id" :orchid="orchid" />
        </div>
        <EmptyState v-else text="本类兰草正在整理" hint="可先浏览其他品类" />
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()

const { data: category, error } = await useFetch(`/api/categories/${route.params.slug}`, {
  key: `category-${route.params.slug}`
})

if (error.value || !category.value) {
  throw createError({ statusCode: 404, statusMessage: '该品类不存在', fatal: true })
}

useHead(() => ({
  title: category.value?.name || '品类',
  meta: [{ name: 'description', content: category.value?.description || '' }]
}))
</script>
