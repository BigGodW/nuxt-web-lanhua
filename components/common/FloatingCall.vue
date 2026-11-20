<template>
  <!-- 仅手机端显示：右下角固定电话按钮，点击直接拨打后台设置的客服电话 -->
  <a
    v-if="phone"
    :href="`tel:${phoneLink}`"
    class="call-fab fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-cinnabar text-paper shadow-card transition-transform active:scale-90 md:hidden"
    :style="{ bottom: 'calc(3.75rem + env(safe-area-inset-bottom))' }"
    aria-label="拨打客服电话"
  >
    <van-icon name="phone" size="20" />
    <span class="absolute inset-0 animate-ping rounded-full bg-cinnabar/30" style="animation-duration: 2.4s" />
  </a>
</template>

<script setup>
const site = useSite()

const phone = computed(() => String(site.value?.phone || '').trim())
// tel: 协议里去掉空格与横线，保留 + 号便于国际格式
const phoneLink = computed(() => phone.value.replace(/[^+\d]/g, ''))
</script>

<style scoped>
.call-fab {
  box-shadow: 0 6px 18px rgba(166, 63, 50, 0.35);
}
</style>
