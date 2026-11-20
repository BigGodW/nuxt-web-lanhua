<template>
  <div class="space-y-5">
    <AdminCard title="第三方平台" :hint="`共 ${platforms?.length || 0} 个，前台「关于」页展示`" body-class="p-0">
      <template #action>
        <button class="admin-btn" @click="openForm()">
          <van-icon name="plus" size="11" />
          新增平台
        </button>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th class="admin-th">Logo</th>
              <th class="admin-th">平台名称 / 说明</th>
              <th class="admin-th">二维码</th>
              <th class="admin-th">跳转链接</th>
              <th class="admin-th">排序</th>
              <th class="admin-th">状态</th>
              <th class="admin-th text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in platforms || []" :key="row.id" class="transition-colors hover:bg-paper-deep/20">
              <td class="admin-td">
                <SmartImage v-if="row.logo" :src="row.logo" :alt="row.name" ratio="1 / 1" w="120" class="w-11 shrink-0" />
                <span v-else class="flex h-11 w-11 items-center justify-center bg-paper-deep/40 font-song text-jade-deep">
                  {{ row.name.slice(0, 1) }}
                </span>
              </td>
              <td class="admin-td">
                <p class="font-song text-[13px] text-ink">{{ row.name }}</p>
                <p class="mt-0.5 line-clamp-1 text-[12px] text-ink-light">{{ row.note || '—' }}</p>
              </td>
              <td class="admin-td">
                <SmartImage v-if="row.qrCode" :src="row.qrCode" :alt="`${row.name}二维码`" ratio="1 / 1" w="120" class="w-11 shrink-0" />
                <span v-else class="text-[12px] text-ink-light">未设置</span>
              </td>
              <td class="admin-td max-w-[200px] truncate text-[12px]">{{ row.link || '—' }}</td>
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
            <tr v-if="!platforms?.length">
              <td colspan="7" class="admin-td py-12 text-center text-ink-light">
                暂无平台，点击右上角「新增平台」添加抖音 / 公众号 / 淘宝等外部渠道
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCard>

    <van-popup v-model:show="formOpen" position="right" :style="{ width: '100%', maxWidth: '520px', height: '100%' }">
      <div class="flex h-full flex-col bg-paper">
        <div class="flex items-center justify-between border-b border-[#E3DBC9] px-5 py-4">
          <p class="font-song text-[16px] tracking-[0.12em] text-jade-deep">
            {{ form.id ? '编辑平台' : '新增平台' }}
          </p>
          <button class="text-ink-light hover:text-cinnabar" @click="formOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div>
            <label class="admin-label">平台名称 <em>*</em></label>
            <input v-model="form.name" class="admin-input" placeholder="如：抖音 / 微信公众号 / 淘宝店铺" />
          </div>

          <div>
            <label class="admin-label">平台说明</label>
            <input v-model="form.note" class="admin-input" placeholder="如：分享养兰日常与开箱视频" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">平台 Logo（建议正方形）</label>
              <ImageUploader v-model="form.logo" type="platform" />
            </div>
            <div>
              <label class="admin-label">二维码（扫码进入）</label>
              <ImageUploader v-model="form.qrCode" type="platform" />
            </div>
          </div>

          <div>
            <label class="admin-label">跳转链接</label>
            <input v-model="form.link" class="admin-input" placeholder="https://v.douyin.com/xxx 或站内 /orchids" />
            <p class="mt-1 text-[12px] text-ink-light">站内链接（/ 开头）站内跳转；外部链接新窗口打开</p>
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
                <span class="text-[12px] text-ink-light">{{ form.isActive ? '展示中' : '已隐藏' }}</span>
              </div>
            </div>
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

const { data: platforms, refresh } = await useFetch('/api/admin/platforms', { key: 'admin-platforms' })

const formOpen = ref(false)
const saving = ref(false)

const blankForm = () => ({
  id: null,
  name: '',
  note: '',
  logo: '',
  qrCode: '',
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
      name: row.name,
      note: row.note || '',
      logo: row.logo || '',
      qrCode: row.qrCode || '',
      link: row.link || '',
      sortOrder: row.sortOrder || 0,
      isActive: !!row.isActive
    })
  }
  formOpen.value = true
}

async function save() {
  if (!form.name.trim()) return toast('请填写平台名称')

  const payload = {
    name: form.name,
    note: form.note,
    logo: form.logo,
    qrCode: form.qrCode,
    link: form.link,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive
  }

  saving.value = true
  try {
    if (form.id) {
      await $fetch(`/api/admin/platforms/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/platforms', { method: 'POST', body: payload })
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
    await showConfirmDialog({ title: '删除平台', message: `确定删除「${row.name}」吗？` })
  } catch {
    return
  }

  try {
    await $fetch(`/api/admin/platforms/${row.id}`, { method: 'DELETE' })
    toast('已删除', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  }
}

useHead({ title: '第三方平台' })
</script>
