<template>
  <section class="relative overflow-hidden bg-jade-deep">
    <div class="relative h-[74vh] min-h-[480px] w-full md:h-[80vh] md:max-h-[780px]">
      <template v-if="banners.length">
        <van-swipe :autoplay="6500" :duration="900" class="h-full" @change="current = $event">
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <div class="relative h-full w-full">
              <SmartImage
                :src="banner.image"
                :alt="banner.title"
                ratio="auto"
                w="1600"
                class="h-full w-full"
                img-class="scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-r from-jade-deep/90 via-jade-deep/55 to-jade-deep/10" />
              <div class="absolute inset-0 bg-gradient-to-t from-jade-deep/80 via-transparent to-transparent" />

              <div class="absolute inset-0">
                <div class="container flex h-full items-center">
                  <div class="max-w-2xl text-paper">
                    <p class="text-[10px] tracking-[0.5em] text-gold-light/80">JIU WAN · ORCHID</p>
                    <h1
                      class="mt-5 font-song text-[34px] leading-[1.35] tracking-[0.12em] md:text-[52px] md:leading-[1.3]"
                    >
                      {{ banner.title }}
                    </h1>
                    <p v-if="banner.subtitle" class="mt-5 max-w-lg text-[13px] leading-7 text-paper/70 md:text-sm">
                      {{ banner.subtitle }}
                    </p>

                    <div class="mt-8 flex flex-wrap items-center gap-3">
                      <NuxtLink
                        :to="banner.link || '/orchids'"
                        class="group inline-flex items-center gap-2 bg-paper px-6 py-3 font-song text-[13px] tracking-[0.2em] text-jade-deep transition-colors hover:bg-gold-light"
                      >
                        入兰谱
                        <van-icon name="arrow" size="12" class="transition-transform group-hover:translate-x-1" />
                      </NuxtLink>
                      <NuxtLink
                        to="/articles"
                        class="inline-flex items-center gap-2 border border-paper/40 px-6 py-3 font-song text-[13px] tracking-[0.2em] text-paper/85 transition-colors hover:border-paper hover:text-paper"
                      >
                        读兰文
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </van-swipe-item>
        </van-swipe>

        <!-- 自定义指示 -->
        <div class="absolute bottom-8 left-0 right-0 z-10">
          <div class="container flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                v-for="(banner, index) in banners"
                :key="banner.id"
                class="h-px transition-all duration-500"
                :class="index === current ? 'w-9 bg-gold-light' : 'w-4 bg-paper/30'"
              />
            </div>
            <div class="hidden items-center gap-3 md:flex">
              <span class="text-[10px] tracking-[0.3em] text-paper/40">九畹清赏</span>
              <span class="h-8 w-px bg-paper/20" />
              <span class="vertical-text font-song text-[11px] text-paper/45">香远益清</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 无轮播时的兜底首屏 -->
      <div v-else class="relative flex h-full items-center bg-gradient-to-br from-jade-deep via-jade to-jade-light">
        <div class="absolute inset-0 bg-paper-grain opacity-40" />
        <div class="container relative">
          <p class="text-[10px] tracking-[0.5em] text-gold-light/80">JIU WAN · ORCHID</p>
          <h1 class="mt-5 font-song text-[36px] leading-[1.4] tracking-[0.14em] text-paper md:text-[52px]">
            一茎一花<br />香远益清
          </h1>
          <p class="mt-6 max-w-md text-[13px] leading-7 text-paper/65">
            九畹 · 国兰清赏，记录春兰、蕙兰、建兰、墨兰、寒兰的中国兰花名品与养护之道。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  banners: { type: Array, default: () => [] }
})

const current = ref(0)
</script>
