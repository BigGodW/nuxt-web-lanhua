<template>
  <section v-if="platforms?.length" class="border-t border-[#E3DBC9]/60 bg-paper-light/40 py-9 md:py-12">
    <div class="container">
      <p class="text-center text-[10px] tracking-[0.35em] text-gold-deep/80">FOLLOW US</p>
      <p class="mt-2 text-center font-song text-[16px] tracking-[0.25em] text-jade-deep">关注蜀杨兰园</p>
      <p class="mt-1.5 text-center text-[11px] tracking-[0.1em] text-ink-light">各平台同名账号，扫码或点击直达</p>

      <div class="mt-5 flex flex-wrap items-stretch justify-center gap-2.5 md:mt-7 md:gap-3">
        <component
          :is="platform.link ? 'a' : 'div'"
          v-for="platform in platforms"
          :key="platform.id"
          :href="platform.link || undefined"
          :target="platform.link && !platform.link.startsWith('/') ? '_blank' : undefined"
          :rel="platform.link ? 'noopener' : undefined"
          class="flex items-center gap-2.5 border border-[#E3DBC9] bg-paper px-3.5 py-2.5 transition-colors md:px-4"
          :class="platform.link ? 'cursor-pointer hover:border-gold/60' : ''"
        >
          <SmartImage
            v-if="platform.logo"
            :src="platform.logo"
            :alt="platform.name"
            ratio="1 / 1"
            w="120"
            class="h-8 w-8 shrink-0"
          />
          <span v-else class="seal flex h-8 w-8 shrink-0 items-center justify-center text-[12px]">
            {{ platform.name.slice(0, 1) }}
          </span>

          <span class="min-w-0">
            <span class="block whitespace-nowrap font-song text-[13px] tracking-[0.08em] text-jade-deep">
              {{ platform.name }}
            </span>
            <span v-if="platform.note" class="mt-0.5 hidden max-w-[11rem] truncate text-[10.5px] text-ink-light sm:block">
              {{ platform.note }}
            </span>
          </span>

          <SmartImage
            v-if="platform.qrCode"
            :src="platform.qrCode"
            :alt="`${platform.name}二维码`"
            ratio="1 / 1"
            w="160"
            class="h-11 w-11 shrink-0"
          />

          <van-icon v-if="platform.link" name="arrow" size="12" class="shrink-0 text-ink-light" />
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
// /api/platforms 服务端缓存 2 分钟，多个页面复用同一 key，不重复请求
const { data: platforms } = await useFetch('/api/platforms', { key: 'platforms-list' })
</script>
