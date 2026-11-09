<template>
  <div class="space-y-5">
    <AdminCard title="轮播列表" :hint="`共 ${banners?.length || 0} 条`" body-class="p-0">
      <template #action>
        <button class="admin-btn" @click="openForm()">
          <van-icon name="plus" size="11" />
          新增轮播
        </button>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th class="admin-th">图片</th>
              <th class="admin-th">标题 / 副标题</th>
              <th class="admin-th">跳转链接</th>
              <th class="admin-th">排序</th>
              <th class="admin-th">状态</th>
              <th class="admin-th text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in banners || []" :key="row.id" class="transition-colors hover:bg-paper-deep/20">
              <td class="admin-td">
                <SmartImage :src="row.image" :alt="row.title" ratio="16 / 10" w="200" class="w-24 shrink-0" />
              </td>
              <td class="admin-td">
                <p class="font-song text-[13px] text-ink">{{ row.title }}</p>
                <p class="mt-0.5 line-clamp-1 text-[11px] text-ink-light">{{ row.subtitle || '—' }}</p>
              </td>
              <td class="admin-td text-[11px]">{{ row.link || '—' }}</td>
              <td class="admin-td">{{ row.sortOrder }}</td>
              <td class="admin-td">
                <span class="status-badge" :class="row.isActive ? 'status-published' : 'status-draft'">
                  {{ row.isActive ? '展示中' : '已隐藏' }}
                </span>
              </td>
              <td class="admin-td">
                <div class="flex items-center justify-end gap-2">
                  <button class="admin-btn-ghost" @click="openForm(row)">编辑</button>
                  <button class="admin-btn-danger" @click="remove(row)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!banners?.length">
              <td colspan="6" class="admin-td py-12 text-center text-ink-light">暂无轮播图，点击右上角添加</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCard>

    <van-popup v-model:show="formOpen" position="right" :style="{ width: '100%', maxWidth: '520px', height: '100%' }">
      <div class="flex h-full flex-col bg-paper">
        <div class="flex items-center justify-between border-b border-[#E3DBC9] px-5 py-4">
          <p class="font-song text-[16px] tracking-[0.12em] text-jade-deep">
            {{ form.id ? '编辑轮播' : '新增轮播' }}
          </p>
          <button class="text-ink-light hover:text-cinnabar" @click="formOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div>
            <label class="admin-label">标题 <em>*</em></label>
            <input v-model="form.title" class="admin-input" placeholder="如：一茎一花，香远益清" />
          </div>

          <div>
            <label class="admin-label">副标题</label>
            <textarea v-model="form.subtitle" class="admin-textarea" rows="2" placeholder="一句话说明，显示在标题下方" />
          </div>

          <div>
            <label class="admin-label">轮播图片（建议 1920×1080 横图）</label>
            <ImageUploader v-model="form.image" type="banner" />
          </div>

          <div>
            <label class="admin-label">跳转链接</label>
            <input v-model="form.link" class="admin-input" placeholder="如：/orchids 或 /articles/xxx" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">排序值</label>
              <input v-model.number="form.sortOrder" type="number" class="admin-input" />
            </div>
            <div>
              <label class="admin-label">是否展示</label>
              <div class="flex h-[34px] items-center gap-2">
                <van-switch v-model="form.isActive" size="18px" />
                <span class="text-[11px] text-ink-light">{{ form.isActive ? '展示中' : '已隐藏' }}</span>
              </div>
            </div>
          </div>

          <div v-if="form.image" class="border border-[#E3DBC9] bg-paper p-2">
            <SmartImage :src="form.image" :alt="form.title" ratio="16 / 9" w="640" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-[#E3DBC9] px-5 py-4">
          <button class="admin-btn-ghost" @click="formOpen = false">取消</button>
          <button class="admin-btn" :disabled="saving" @click="save">{{ saving ? '保存中…' : '保存' }}</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { showConfirmDialog } from 'vant'

definePageMeta({ layout: 'admin' })

const { data: banners, refresh } = await useFetch('/api/admin/banners', { key: 'admin-banners' })

const formOpen = ref(false)
const saving = ref(false)

const blankForm = () => ({
  id: null,
  title: '',
  subtitle: '',
  image: '',
  link: '',
  sortOrder: 0,
  isActive: true
})

const form = reactive(blankForm())

function openForm(row = null) {
  Object.assign(form, blankForm())
  if (row) {
    Object.assign(form, {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || '',
      image: row.image || '',
      link: row.link || '',
      sortOrder: row.sortOrder || 0,
      isActive: !!row.isActive
    })
  }
  formOpen.value = true
}

async function save() {
  if (!form.title.trim()) return toast('请填写轮播标题')

  const payload = {
    title: form.title,
    subtitle: form.subtitle,
    image: form.image,
    link: form.link,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive
  }

  saving.value = true
  try {
    if (form.id) {
      await $fetch(`/api/admin/banners/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/banners', { method: 'POST', body: payload })
    }
    toast('已保存', 'success')
    formOpen.value = false
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  } finally {
    saving.value = false
  }
}

async function remove(row) {
  try {
    await showConfirmDialog({ title: '删除轮播', message: `确定删除「${row.title}」吗？` })
  } catch {
    return
  }

  try {
    await $fetch(`/api/admin/banners/${row.id}`, { method: 'DELETE' })
    toast('已删除', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  }
}

useHead({ title: '轮播管理' })
</script>
