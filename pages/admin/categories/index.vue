<template>
  <div class="space-y-5">
    <AdminCard title="品类列表" :hint="`共 ${categories?.length || 0} 个品类`" body-class="p-0">
      <template #action>
        <button class="admin-btn" @click="openForm()">
          <van-icon name="plus" size="11" />
          新增品类
        </button>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th class="admin-th">品类</th>
              <th class="admin-th">副标题</th>
              <th class="admin-th">品种数</th>
              <th class="admin-th">排序</th>
              <th class="admin-th">状态</th>
              <th class="admin-th text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in categories || []" :key="row.id" class="transition-colors hover:bg-paper-deep/20">
              <td class="admin-td">
                <div class="flex items-center gap-3">
                  <SmartImage :src="row.cover" :alt="row.name" ratio="1 / 1" w="120" class="w-11 shrink-0" />
                  <div>
                    <p class="font-song text-[13px] text-ink">{{ row.name }}</p>
                    <p class="mt-0.5 text-[11px] text-ink-light">{{ row.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="admin-td">{{ row.subtitle || '—' }}</td>
              <td class="admin-td">{{ row._count?.orchids || 0 }}</td>
              <td class="admin-td">{{ row.sortOrder }}</td>
              <td class="admin-td">
                <span class="status-badge" :class="row.isActive ? 'status-published' : 'status-draft'">
                  {{ row.isActive ? '启用' : '停用' }}
                </span>
              </td>
              <td class="admin-td">
                <div class="flex items-center justify-end gap-2">
                  <button class="admin-btn-ghost" @click="openForm(row)">编辑</button>
                  <button class="admin-btn-danger" @click="remove(row)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!categories?.length">
              <td colspan="6" class="admin-td py-12 text-center text-ink-light">暂无品类</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminCard>

    <van-popup v-model:show="formOpen" position="right" :style="{ width: '100%', maxWidth: '520px', height: '100%' }">
      <div class="flex h-full flex-col bg-paper">
        <div class="flex items-center justify-between border-b border-[#E3DBC9] px-5 py-4">
          <p class="font-song text-[16px] tracking-[0.12em] text-jade-deep">
            {{ form.id ? '编辑品类' : '新增品类' }}
          </p>
          <button class="text-ink-light hover:text-cinnabar" @click="formOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">品类名称 <em>*</em></label>
              <input v-model="form.name" class="admin-input" placeholder="如：春兰" />
            </div>
            <div>
              <label class="admin-label">访问标识（slug）</label>
              <input v-model="form.slug" class="admin-input" placeholder="留空自动生成，如 chunlan" />
            </div>
          </div>

          <div>
            <label class="admin-label">副标题</label>
            <input v-model="form.subtitle" class="admin-input" placeholder="如：一茎一花 · 幽香清远" />
          </div>

          <div>
            <label class="admin-label">封面图</label>
            <ImageUploader v-model="form.cover" type="category" />
          </div>

          <div>
            <label class="admin-label">品类简介</label>
            <textarea v-model="form.description" class="admin-textarea" rows="5" placeholder="介绍该品类的叶形、花期、香气与代表品种" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">排序值</label>
              <input v-model.number="form.sortOrder" type="number" class="admin-input" />
            </div>
            <div>
              <label class="admin-label">是否启用</label>
              <div class="flex h-[34px] items-center gap-2">
                <van-switch v-model="form.isActive" size="18px" />
                <span class="text-[11px] text-ink-light">{{ form.isActive ? '前台显示' : '前台隐藏' }}</span>
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

const { data: categories, refresh } = await useFetch('/api/admin/categories', { key: 'admin-categories-page' })

const formOpen = ref(false)
const saving = ref(false)

const blankForm = () => ({
  id: null,
  name: '',
  slug: '',
  subtitle: '',
  cover: '',
  description: '',
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
      slug: row.slug,
      subtitle: row.subtitle || '',
      cover: row.cover || '',
      description: row.description || '',
      sortOrder: row.sortOrder || 0,
      isActive: !!row.isActive
    })
  }
  formOpen.value = true
}

async function save() {
  if (!form.name.trim()) return toast('请填写品类名称')

  const payload = {
    name: form.name,
    slug: form.slug,
    subtitle: form.subtitle,
    cover: form.cover,
    description: form.description,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive
  }

  saving.value = true
  try {
    if (form.id) {
      await $fetch(`/api/admin/categories/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/categories', { method: 'POST', body: payload })
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
    await showConfirmDialog({
      title: '删除品类',
      message: `确定删除「${row.name}」吗？该品类下有 ${row._count?.orchids || 0} 个品种。`
    })
  } catch {
    return
  }

  try {
    await $fetch(`/api/admin/categories/${row.id}`, { method: 'DELETE' })
    toast('已删除', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  }
}

useHead({ title: '品类管理' })
</script>
