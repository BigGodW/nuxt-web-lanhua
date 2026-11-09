<template>
  <div @dragover.prevent @drop.prevent="onDrop">
    <!-- 单图 -->
    <div v-if="!multiple" class="flex items-start gap-3">
      <div v-if="single" class="group relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-[#E3DBC9]">
        <img :src="thumb(single)" alt="" class="h-full w-full object-cover" />
        <button type="button" class="img-del" @click="single = ''">×</button>
      </div>
      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex items-center gap-2">
          <button type="button" class="admin-btn-ghost" :disabled="uploading" @click="pick">
            {{ uploading ? '上传中…' : single ? '重新上传' : '上传图片' }}
          </button>
          <span class="text-[11px] text-ink-light">自动压缩后存七牛云</span>
        </div>
        <input v-model.trim="single" class="admin-input" placeholder="也可直接粘贴图片地址" />
      </div>
    </div>

    <!-- 多图 -->
    <div v-else>
      <div class="flex flex-wrap gap-2.5">
        <div
          v-for="(item, index) in list"
          :key="`${item}-${index}`"
          class="group relative h-20 w-20 overflow-hidden border border-[#E3DBC9] bg-paper"
        >
          <img :src="thumb(item)" alt="" class="h-full w-full object-cover" />
          <span class="absolute bottom-0 left-0 bg-jade-deep/70 px-1 text-[10px] text-paper">{{ index + 1 }}</span>
          <button type="button" class="img-del" @click="removeAt(index)">×</button>
        </div>

        <button
          v-if="list.length < max"
          type="button"
          class="flex h-20 w-20 flex-col items-center justify-center gap-1 border border-dashed border-[#C9BEA4] text-[11px] text-ink-light transition-colors hover:border-gold hover:text-gold-deep"
          :disabled="uploading"
          @click="pick"
        >
          <van-icon :name="uploading ? 'replay' : 'plus'" size="16" />
          {{ uploading ? '上传中' : '添加' }}
        </button>
      </div>
      <p class="mt-2 text-[11px] text-ink-light">最多 {{ max }} 张，上传后自动压缩；拖动文件到框内也可上传。</p>
    </div>

    <input ref="inputRef" type="file" accept="image/*" :multiple="multiple" class="hidden" @change="onSelect" />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  multiple: { type: Boolean, default: false },
  max: { type: Number, default: 8 },
  // 上传目录：orchid / article / banner / category
  type: { type: String, default: 'misc' }
})

const emit = defineEmits(['update:modelValue'])

const { img } = useImage()
const uploading = ref(false)
const inputRef = ref(null)

const list = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

const single = computed({
  get: () => (Array.isArray(props.modelValue) ? '' : props.modelValue || ''),
  set: (value) => emit('update:modelValue', value)
})

function thumb(src) {
  return img(src, 160)
}

function pick() {
  inputRef.value?.click()
}

function removeAt(index) {
  const next = [...list.value]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

async function uploadOne(file) {
  const form = new FormData()
  form.append('file', file)
  const result = await $fetch('/api/admin/upload', { method: 'POST', body: form, query: { type: props.type } })
  return result?.url || ''
}

async function uploadFiles(files) {
  const targets = Array.from(files || []).filter((file) => file.type.startsWith('image/'))
  if (!targets.length) return

  uploading.value = true
  try {
    if (props.multiple) {
      const urls = []
      for (const file of targets.slice(0, Math.max(0, props.max - list.value.length))) {
        urls.push(await uploadOne(file))
      }
      const next = [...list.value, ...urls.filter(Boolean)].slice(0, props.max)
      emit('update:modelValue', next)
      if (urls.filter(Boolean).length) toast('上传成功', 'success')
    } else {
      const url = await uploadOne(targets[0])
      if (url) {
        single.value = url
        toast('上传成功', 'success')
      }
    }
  } catch (error) {
    toast(errorMessage(error, '图片上传失败'))
  } finally {
    uploading.value = false
    if (inputRef.value) inputRef.value.value = ''
  }
}

function onSelect(event) {
  uploadFiles(event.target.files)
}

function onDrop(event) {
  uploadFiles(event.dataTransfer?.files)
}
</script>

<style scoped>
.img-del {
  position: absolute;
  top: 0;
  right: 0;
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  background: rgba(20, 30, 25, 0.62);
  color: #f7f3e9;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.2s;
}

.group:hover .img-del {
  opacity: 1;
}
</style>
