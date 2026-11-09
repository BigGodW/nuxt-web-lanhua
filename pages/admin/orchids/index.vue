<template>
  <div class="space-y-5">
    <AdminCard title="品种列表" :hint="`共 ${data?.total || 0} 条记录`" body-class="p-0">
      <template #action>
        <button class="admin-btn" @click="openForm()">
          <van-icon name="plus" size="11" />
          新增品种
        </button>
      </template>

      <!-- 筛选 -->
      <div class="flex flex-col gap-3 border-b border-[#E3DBC9] p-4 md:flex-row md:items-center">
        <input v-model="keyword" class="admin-input md:w-56" placeholder="搜索品种名称 / 别名" @input="onSearch" />
        <select v-model="categoryId" class="admin-select md:w-40" @change="page = 1">
          <option value="">全部品类</option>
          <option v-for="item in categories || []" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
        </select>
        <select v-model="status" class="admin-select md:w-32" @change="page = 1">
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        <span class="ml-auto hidden text-[11px] text-ink-light md:block">共 {{ data?.total || 0 }} 条</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[860px] border-collapse">
          <thead>
            <tr>
              <th class="admin-th">品种</th>
              <th class="admin-th">品类</th>
              <th class="admin-th">花期</th>
              <th class="admin-th">状态</th>
              <th class="admin-th">推荐</th>
              <th class="admin-th">排序</th>
              <th class="admin-th text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data?.list || []" :key="row.id" class="transition-colors hover:bg-paper-deep/20">
              <td class="admin-td">
                <div class="flex items-center gap-3">
                  <SmartImage :src="row.cover" :alt="row.name" ratio="1 / 1" w="120" class="w-11 shrink-0" />
                  <div class="min-w-0">
                    <p class="font-song text-[13px] text-ink">{{ row.name }}</p>
                    <p class="mt-0.5 truncate text-[11px] text-ink-light">{{ row.alias || row.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="admin-td">{{ row.category?.name || '—' }}</td>
              <td class="admin-td">{{ row.flowering || '—' }}</td>
              <td class="admin-td">
                <span class="status-badge" :class="row.status === 'published' ? 'status-published' : 'status-draft'">
                  {{ row.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="admin-td">
                <span :class="row.isFeatured ? 'text-cinnabar' : 'text-ink-light'">
                  {{ row.isFeatured ? '是' : '否' }}
                </span>
              </td>
              <td class="admin-td">{{ row.sortOrder }}</td>
              <td class="admin-td">
                <div class="flex items-center justify-end gap-2">
                  <button class="admin-btn-ghost" @click="openForm(row)">编辑</button>
                  <button class="admin-btn-danger" @click="remove(row)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!data?.list?.length">
              <td colspan="7" class="admin-td py-12 text-center text-ink-light">
                暂无品种，点击右上角「新增品种」开始录入
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdminPager
        :page="data?.page || 1"
        :total-pages="data?.totalPages || 1"
        :total="data?.total || 0"
        @change="page = $event"
      />
    </AdminCard>

    <!-- 编辑抽屉 -->
    <van-popup v-model:show="formOpen" position="right" :style="{ width: '100%', maxWidth: '640px', height: '100%' }">
      <div class="flex h-full flex-col bg-paper">
        <div class="flex items-center justify-between border-b border-[#E3DBC9] px-5 py-4">
          <div>
            <p class="font-song text-[16px] tracking-[0.12em] text-jade-deep">
              {{ form.id ? '编辑品种' : '新增品种' }}
            </p>
            <p class="mt-0.5 text-[11px] text-ink-light">带 * 为必填项</p>
          </div>
          <button class="text-ink-light hover:text-cinnabar" @click="formOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">品种名称 <em>*</em></label>
              <input v-model="form.name" class="admin-input" placeholder="如：宋梅" />
            </div>
            <div>
              <label class="admin-label">别名 / 雅称</label>
              <input v-model="form.alias" class="admin-input" placeholder="如：宋锦璇梅" />
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">所属品类 <em>*</em></label>
              <select v-model="form.categoryId" class="admin-select">
                <option value="">请选择品类</option>
                <option v-for="item in categories || []" :key="item.id" :value="String(item.id)">{{ item.name }}</option>
              </select>
            </div>
            <div>
              <label class="admin-label">访问标识（slug）</label>
              <input v-model="form.slug" class="admin-input" placeholder="留空自动生成，如 songmei" />
            </div>
          </div>

          <div>
            <label class="admin-label">封面图</label>
            <ImageUploader v-model="form.cover" type="orchid" />
          </div>

          <div>
            <label class="admin-label">图集</label>
            <ImageUploader v-model="form.images" type="orchid" multiple :max="9" />
          </div>

          <div>
            <label class="admin-label">一句话摘要</label>
            <textarea v-model="form.summary" class="admin-textarea" rows="2" placeholder="用于列表与详情页的简介" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">产地</label>
              <input v-model="form.origin" class="admin-input" placeholder="如：浙江绍兴" />
            </div>
            <div>
              <label class="admin-label">花期</label>
              <input v-model="form.flowering" class="admin-input" placeholder="如：2 月—3 月" />
            </div>
            <div>
              <label class="admin-label">香气</label>
              <input v-model="form.fragrance" class="admin-input" placeholder="如：幽香清远" />
            </div>
            <div>
              <label class="admin-label">养护难度</label>
              <input v-model="form.difficulty" class="admin-input" placeholder="如：中等" />
            </div>
            <div>
              <label class="admin-label">光照</label>
              <input v-model="form.light" class="admin-input" placeholder="如：半阴散射光" />
            </div>
            <div>
              <label class="admin-label">标签（逗号分隔）</label>
              <input v-model="form.tagsText" class="admin-input" placeholder="梅瓣, 经典名品" />
            </div>
          </div>

          <div>
            <label class="admin-label">详细介绍</label>
            <textarea
              v-model="form.content"
              class="admin-textarea font-mono text-[12px]"
              rows="10"
              placeholder="支持 HTML，如 <p>正文</p><h3>小标题</h3>"
            />
            <p class="mt-1 text-[11px] text-ink-light">支持 &lt;p&gt;、&lt;h3&gt;、&lt;blockquote&gt;、&lt;ul&gt; 等基础标签</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="admin-label">排序值</label>
              <input v-model.number="form.sortOrder" type="number" class="admin-input" />
            </div>
            <div>
              <label class="admin-label">状态</label>
              <select v-model="form.status" class="admin-select">
                <option value="published">发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>
            <div>
              <label class="admin-label">首页推荐</label>
              <div class="flex h-[34px] items-center gap-2">
                <van-switch v-model="form.isFeatured" size="18px" />
                <span class="text-[11px] text-ink-light">{{ form.isFeatured ? '已推荐' : '不推荐' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-[#E3DBC9] px-5 py-4">
          <button class="admin-btn-ghost" @click="formOpen = false">取消</button>
          <button class="admin-btn" :disabled="saving" @click="save">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { showConfirmDialog } from 'vant'

definePageMeta({ layout: 'admin' })

const keyword = ref('')
const categoryId = ref('')
const status = ref('')
const page = ref(1)

const { data, refresh } = await useFetch('/api/admin/orchids', {
  key: 'admin-orchids',
  query: computed(() => ({
    page: page.value,
    pageSize: 10,
    keyword: keyword.value.trim() || undefined,
    categoryId: categoryId.value || undefined,
    status: status.value || undefined
  }))
})

const { data: categories } = await useFetch('/api/admin/categories', { key: 'admin-categories' })

let timer = null
function onSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    page.value = 1
  }, 400)
}

/* -------------------- 表单 -------------------- */

const formOpen = ref(false)
const saving = ref(false)

const blankForm = () => ({
  id: null,
  name: '',
  alias: '',
  categoryId: '',
  slug: '',
  cover: '',
  images: [],
  summary: '',
  content: '',
  origin: '',
  flowering: '',
  fragrance: '',
  difficulty: '',
  light: '',
  tagsText: '',
  isFeatured: false,
  status: 'published',
  sortOrder: 0
})

const form = reactive(blankForm())

function openForm(row = null) {
  Object.assign(form, blankForm())

  if (row) {
    Object.assign(form, {
      id: row.id,
      name: row.name,
      alias: row.alias || '',
      categoryId: String(row.categoryId),
      slug: row.slug,
      cover: row.cover || '',
      images: [...(row.images || [])],
      summary: row.summary || '',
      content: row.content || '',
      origin: row.origin || '',
      flowering: row.flowering || '',
      fragrance: row.fragrance || '',
      difficulty: row.difficulty || '',
      light: row.light || '',
      tagsText: (row.tags || []).join(', '),
      isFeatured: !!row.isFeatured,
      status: row.status,
      sortOrder: row.sortOrder || 0
    })
  }

  formOpen.value = true
}

function splitList(value) {
  return String(value || '')
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

async function save() {
  if (!form.name.trim()) return toast('请填写品种名称')
  if (!form.categoryId) return toast('请选择所属品类')

  const payload = {
    name: form.name,
    alias: form.alias,
    categoryId: Number(form.categoryId),
    slug: form.slug,
    cover: form.cover,
    images: form.images,
    summary: form.summary,
    content: form.content,
    origin: form.origin,
    flowering: form.flowering,
    fragrance: form.fragrance,
    difficulty: form.difficulty,
    light: form.light,
    tags: splitList(form.tagsText),
    isFeatured: form.isFeatured,
    status: form.status,
    sortOrder: Number(form.sortOrder) || 0
  }

  saving.value = true
  try {
    if (form.id) {
      await $fetch(`/api/admin/orchids/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/orchids', { method: 'POST', body: payload })
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
      title: '删除品种',
      message: `确定删除「${row.name}」吗？删除后前台将不再显示。`
    })
  } catch {
    return
  }

  try {
    await $fetch(`/api/admin/orchids/${row.id}`, { method: 'DELETE' })
    toast('已删除', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  }
}

useHead({ title: '品种管理' })
</script>
