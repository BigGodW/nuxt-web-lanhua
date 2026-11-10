<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    round
    :style="{ background: '#F7F3E9' }"
    :safe-area-inset-bottom="true"
  >
    <div class="mx-auto max-w-md px-5 pb-4 pt-5">
      <div class="flex items-start justify-between">
        <div>
          <p class="font-song text-[15px] tracking-[0.14em] text-jade-deep">分享此{{ label }}</p>
          <p class="mt-1 line-clamp-1 text-[11px] text-ink-light">{{ title }}</p>
        </div>
        <button class="-mr-2 flex h-10 w-10 items-center justify-center text-ink-light hover:text-cinnabar" @click="show = false">
          <van-icon name="cross" size="16" />
        </button>
      </div>

      <div class="mt-5 grid grid-cols-5 gap-1">
        <button v-for="item in actions" :key="item.key" class="share-item" @click="item.run">
          <span class="share-icon" :style="{ color: item.color }">
            <svg v-if="item.icon === 'wechat'" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
              <path
                d="M9.2 3C5.2 3 2 5.7 2 9c0 1.9 1.1 3.6 2.8 4.7L4.2 16l2.5-1.3c.8.2 1.6.3 2.5.3h.4a5.6 5.6 0 0 1-.2-1.5c0-3.4 3.1-6.1 6.9-6.1h.5C16.2 4.7 13 3 9.2 3Zm-2.6 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm5.2 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z"
              />
              <path
                d="M22 13.7c0-2.7-2.7-4.9-6-4.9s-6 2.2-6 4.9 2.7 4.9 6 4.9c.7 0 1.4-.1 2-.3l2.1 1.1-.6-1.9c1.6-.9 2.5-2.3 2.5-3.8Zm-8-1.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm4 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"
              />
            </svg>
            <svg v-else-if="item.icon === 'moments'" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-6 w-6">
              <circle cx="12" cy="12" r="8.4" stroke-width="1.7" />
              <circle cx="12" cy="12" r="3.1" fill="currentColor" stroke="none" />
            </svg>
            <svg v-else-if="item.icon === 'douyin'" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
              <path
                d="M16.6 3h-2.7v11.2a2.4 2.4 0 1 1-2.4-2.4c.3 0 .6 0 .8.1V9.1a5.2 5.2 0 1 0 4.3 5.1V8.3c.9.7 2 1.1 3.4 1.2V6.8c-1.9-.2-3.4-1.7-3.4-3.8Z"
              />
            </svg>
            <van-icon v-else :name="item.icon" size="22" />
          </span>
          <span class="mt-2 text-[11px] leading-4 text-ink-soft">{{ item.label }}</span>
        </button>
      </div>

      <p class="mt-4 border-t border-[#E7DFCD] pt-3 text-center text-[10px] leading-5 tracking-[0.08em] text-ink-light">
        分享海报含二维码，可直接发布到微信、抖音、小红书
      </p>
    </div>
  </van-popup>

  <!-- 微信 / 抖音 内分享引导 -->
  <Teleport to="body">
    <div v-if="guide" class="fixed inset-0 z-[3000] bg-black/75 backdrop-blur-[1px]" @click="guide = ''">
      <div class="mx-auto max-w-md px-6 pt-4 text-right text-paper">
        <div class="ml-auto w-fit animate-bounce">
          <svg viewBox="0 0 60 60" class="h-14 w-14" fill="none" stroke="#F7F3E9" stroke-width="2.4">
            <path d="M6 52C6 30 18 14 44 10" stroke-linecap="round" />
            <path d="M34 6l12 3-3 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <p class="mt-2 font-song text-[15px] tracking-[0.12em]">
          {{ guide === 'douyin' ? '点击右上角「···」分享' : '点击右上角「···」' }}
        </p>
        <p class="mt-2 text-[12px] leading-6 text-paper/70">
          {{ guide === 'douyin' ? '选择「分享给朋友」或「保存图片」发布到抖音' : '选择「发送给朋友」或「分享到朋友圈」' }}
        </p>
        <p class="mt-6 text-[11px] text-paper/50">点击任意处关闭</p>
      </div>
    </div>
  </Teleport>

  <!-- 海报 -->
  <van-popup v-model:show="posterOpen" round :style="{ background: '#F7F3E9', width: '86%', maxWidth: '380px' }">
    <div class="px-4 pb-5 pt-4">
      <div class="flex items-center justify-between">
        <p class="font-song text-[14px] tracking-[0.14em] text-jade-deep">分享海报</p>
        <button class="text-ink-light hover:text-cinnabar" @click="posterOpen = false">
          <van-icon name="cross" size="15" />
        </button>
      </div>

      <div class="mt-3 flex min-h-[280px] items-center justify-center bg-paper-deep/40 p-2">
        <div v-if="posterLoading" class="flex flex-col items-center gap-2 text-[11px] text-ink-light">
          <van-loading size="20" color="#24382F" />
          正在生成…
        </div>
        <img v-else-if="poster" :src="poster" alt="分享海报" class="w-full shadow-card" />
        <p v-else class="text-[11px] text-ink-light">海报生成失败，请稍后重试</p>
      </div>

      <!-- 二维码指向的真实链接：方便核对，也允许直接复制 -->
      <button
        class="mt-2 flex w-full items-center gap-1.5 text-[10.5px] leading-4 text-ink-light hover:text-jade-deep"
        @click="handleCopy"
      >
        <van-icon name="link-o" size="12" class="shrink-0" />
        <span class="min-w-0 flex-1 truncate text-left">{{ link }}</span>
        <span class="shrink-0 text-gold-deep">复制</span>
      </button>

      <p class="mt-2 text-center text-[11px] leading-5 text-ink-light">
        {{ isMobile ? '长按图片保存到相册，再发布到微信 / 抖音' : '点击下载保存图片，再发布到微信 / 抖音' }}
      </p>

      <div class="mt-3 flex gap-3">
        <button class="admin-btn-ghost flex-1" :disabled="!poster" @click="savePoster">下载图片</button>
        <button class="admin-btn flex-1" @click="regen">重新生成</button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, default: '' },
  // 站内路径，如 /orchids/songmei
  path: { type: String, default: '' },
  tag: { type: String, default: '国兰清赏' },
  seal: { type: String, default: '兰' },
  label: { type: String, default: '内容' }
})

const emit = defineEmits(['update:modelValue'])

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const { absolute, shareImage, env, copyText, setupWechat, makePoster, download } = useShare()

const guide = ref('')
const posterOpen = ref(false)
const posterLoading = ref(false)
const poster = ref('')

const link = computed(() => absolute(props.path))
const ogImage = computed(() => shareImage(props.image, 500))
// env() 是函数，模板里不能直接写 env.mobile，否则永远是 undefined
const isMobile = computed(() => env().mobile)

async function handleWechat(target) {
  if (!env().inWeChat) {
    const ok = await copyText(link.value)
    toast(ok ? '链接已复制，打开微信粘贴给好友' : '复制失败，请手动复制链接')
    show.value = false
    return
  }

  const result = await setupWechat({
    title: props.title,
    desc: props.desc,
    link: link.value,
    imgUrl: ogImage.value
  })

  guide.value = target
  show.value = false
  if (!result.enabled && target === 'moments') {
    toast('请在微信内使用右上角分享到朋友圈')
  }
}

async function handleDouyin() {
  const ok = await copyText(link.value)
  if (env().inDouyin) {
    guide.value = 'douyin'
  } else {
    toast(ok ? '链接已复制，打开抖音粘贴到搜索框即可打开' : '复制失败，请手动复制链接')
  }
  show.value = false
}

async function handleCopy() {
  const ok = await copyText(link.value)
  toast(ok ? '链接已复制' : '复制失败，请手动复制')
  if (ok) show.value = false
}

async function handleNative() {
  if (!import.meta.client || !navigator.share) return handleCopy()
  try {
    await navigator.share({ title: props.title, text: props.desc, url: link.value })
    show.value = false
  } catch {
    /* 用户取消 */
  }
}

async function build() {
  posterLoading.value = true
  poster.value = ''
  try {
    poster.value = await makePoster({
      title: props.title,
      desc: props.desc,
      image: props.image,
      url: link.value,
      tag: props.tag,
      seal: props.seal
    })
  } catch (error) {
    toast(error.message || '海报生成失败')
  } finally {
    posterLoading.value = false
  }
}

async function handlePoster() {
  posterOpen.value = true
  show.value = false
  await build()
}

function regen() {
  build()
}

function savePoster() {
  if (!poster.value) return
  download(poster.value, `${String(props.title || 'jiuwan').slice(0, 20)}.jpg`)
}

const actions = computed(() => {
  const list = [
    { key: 'wechat', label: '微信好友', icon: 'wechat', color: '#3E9E48', run: () => handleWechat('wechat') },
    { key: 'moments', label: '朋友圈', icon: 'moments', color: '#3E9E48', run: () => handleWechat('moments') },
    { key: 'douyin', label: '抖音', icon: 'douyin', color: '#1B1B1B', run: handleDouyin },
    { key: 'copy', label: '复制链接', icon: 'link-o', color: '#8A7A55', run: handleCopy },
    { key: 'poster', label: '分享海报', icon: 'photograph', color: '#B23B2E', run: handlePoster }
  ]
  if (import.meta.client && navigator.share) {
    list.push({ key: 'more', label: '更多', icon: 'share-o', color: '#5C7566', run: handleNative })
  }
  return list
})
</script>

<style scoped>
.share-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
  transition: transform 0.2s;
}

.share-item:active {
  transform: scale(0.94);
}

.share-icon {
  display: flex;
  height: 46px;
  width: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid #e7dfcd;
  box-shadow: 0 1px 2px rgba(36, 56, 47, 0.06);
}
</style>
