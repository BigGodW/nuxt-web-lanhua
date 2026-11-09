<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
    <div class="flex items-center gap-3">
      <span class="seal h-11 w-11 text-lg">兰</span>
      <span class="font-song text-xl tracking-[0.3em] text-jade-deep">九畹</span>
    </div>

    <p class="mt-10 font-song text-[64px] leading-none text-jade-deep/15 md:text-[96px]">
      {{ error?.statusCode || 404 }}
    </p>

    <h1 class="mt-4 font-song text-[20px] tracking-[0.2em] text-jade-deep md:text-[24px]">
      {{ title }}
    </h1>
    <p class="mt-3 max-w-md text-[13px] leading-7 text-ink-light">
      {{ error?.statusMessage || '这一页如兰草隐于深林，暂时寻不见了。' }}
    </p>

    <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
      <button
        class="bg-jade-deep px-6 py-3 font-song text-[13px] tracking-[0.2em] text-paper transition-colors hover:bg-jade"
        @click="goHome"
      >
        返回首页
      </button>
      <NuxtLink
        to="/orchids"
        class="border border-jade-deep/30 px-6 py-3 font-song text-[13px] tracking-[0.2em] text-jade-deep transition-colors hover:border-jade-deep"
      >
        浏览兰谱
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: { type: Object, default: () => ({}) }
})

const title = computed(() => {
  const code = props.error?.statusCode
  if (code === 404) return '寻兰不遇'
  if (code === 401) return '请先登录'
  return '出了点小状况'
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>
