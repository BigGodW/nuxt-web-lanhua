<template>
  <div class="space-y-5">
    <AdminCard title="文章列表" :hint="`共 ${data?.total || 0} 篇`" body-class="p-0">
      <template #action>
        <button class="admin-btn" @click="openForm()">
          <van-icon name="plus" size="11" />
          撰写文章
        </button>
      </template>

      <div class="flex flex-col gap-3 border-b border-[#E3DBC9] p-4 md:flex-row md:items-center">
        <input v-model="keyword" class="admin-input md:w-56" placeholder="搜索文章标题" @input="onSearch" />
        <select v-model="category" class="admin-select md:w-36" @change="page = 1">
          <option value="">全部分类</option>
          <option v-for="item in articleCategories" :key="item" :value="item">{{ item }}</option>
        </select>
        <select v-model="status" class="admin-select md:w-32" @change="page = 1">
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[880px] border-collapse">
          <thead>
            <tr>
              <th class="admin-th">文章</th>
              <th class="admin-th">分类</th>
              <th class="admin-th">作者</th>
              <th class="admin-th">发布时间</th>
              <th class="admin-th">浏览</th>
              <th class="admin-th">状态</th>
              <th class="admin-th text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data?.list || []" :key="row.id" class="transition-colors hover:bg-paper-deep/20">
              <td class="admin-td">
                <div class="flex items-center gap-3">
                  <SmartImage :src="row.cover" :alt="row.title" ratio="4 / 3" w="120" class="w-14 shrink-0" />
                  <div class="min-w-0 max-w-[280px]">
                    <p class="truncate font-song text-[13px] text-ink">{{ row.title }}</p>
                    <p class="mt-0.5 truncate text-[11px] text-ink-light">
                      <span v-if="row.isTop" class="text-cinnabar">[置顶] </span>{{ row.slug }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="admin-td">{{ row.category }}</td>
              <td class="admin-td">{{ row.author }}</td>
              <td class="admin-td">{{ formatDate(row.publishedAt) }}</td>
              <td class="admin-td">{{ row.viewCount }}</td>
              <td class="admin-td">
                <span class="status-badge" :class="row.status === 'published' ? 'status-published' : 'status-draft'">
                  {{ row.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </td>
              <td class="admin-td">
                <div class="flex items-center justify-end gap-2">
                  <button class="admin-btn-ghost" @click="openForm(row)">编辑</button>
                  <button class="admin-btn-danger" @click="remove(row)">删除</button>
                </div>
              </td>
            </tr>
            <tr v-if="!data?.list?.length">
              <td colspan="7" class="admin-td py-12 text-center text-ink-light">暂无文章，点击右上角开始撰写</td>
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

    <van-popup v-model:show="formOpen" position="right" :style="{ width: '100%', maxWidth: '720px', height: '100%' }">
      <div class="flex h-full flex-col bg-paper">
        <div class="flex items-center justify-between border-b border-[#E3DBC9] px-5 py-4">
          <div>
            <p class="font-song text-[16px] tracking-[0.12em] text-jade-deep">
              {{ form.id ? '编辑文章' : '撰写文章' }}
            </p>
            <p class="mt-0.5 text-[11px] text-ink-light">正文支持 HTML 片段</p>
          </div>
          <button class="text-ink-light hover:text-cinnabar" @click="formOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div>
            <label class="admin-label">文章标题 <em>*</em></label>
            <input v-model="form.title" class="admin-input" placeholder="如：国兰之美：一茎一花，香远益清" />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">分类</label>
              <select v-model="form.category" class="admin-select">
                <option v-for="item in articleCategories" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div>
              <label class="admin-label">作者</label>
              <input v-model="form.author" class="admin-input" placeholder="九畹编辑部" />
            </div>
            <div>
              <label class="admin-label">访问标识（slug）</label>
              <input v-model="form.slug" class="admin-input" placeholder="留空自动生成" />
            </div>
            <div>
              <label class="admin-label">发布日期</label>
              <input v-model="form.publishedAt" type="date" class="admin-input" />
            </div>
          </div>

          <div>
            <label class="admin-label">封面图</label>
            <ImageUploader v-model="form.cover" type="article" />
          </div>

          <div>
            <label class="admin-label">摘要</label>
            <textarea v-model="form.summary" class="admin-textarea" rows="2" placeholder="用于列表展示的摘要" />
          </div>

          <div>
            <label class="admin-label">正文</label>
            <textarea
              v-model="form.content"
              class="admin-textarea font-mono text-[12px]"
              rows="16"
              placeholder="<p>正文段落</p><h2>小标题</h2>"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="admin-label">标签（逗号分隔）</label>
              <input v-model="form.tagsText" class="admin-input" placeholder="兰文化, 鉴赏" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="admin-label">状态</label>
                <select v-model="form.status" class="admin-select">
                  <option value="published">发布</option>
                  <option value="draft">草稿</option>
                </select>
              </div>
              <div>
                <label class="admin-label">置顶</label>
                <div class="flex h-[34px] items-center gap-2">
                  <van-switch v-model="form.isTop" size="18px" />
                  <span class="text-[11px] text-ink-light">{{ form.isTop ? '已置顶' : '普通' }}</span>
                </div>
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
import { formatDate } from '~/utils/date'

definePageMeta({ layout: 'admin' })

const articleCategories = ['兰文化', '鉴赏', '养护', '动态']

const keyword = ref('')
const category = ref('')
const status = ref('')
const page = ref(1)

const { data, refresh } = await useFetch('/api/admin/articles', {
  key: 'admin-articles',
  query: computed(() => ({
    page: page.value,
    pageSize: 10,
    keyword: keyword.value.trim() || undefined,
    category: category.value || undefined,
    status: status.value || undefined
  }))
})

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

const todayInput = () => new Date().toISOString().slice(0, 10)

const blankForm = () => ({
  id: null,
  title: '',
  slug: '',
  category: '兰文化',
  author: '九畹编辑部',
  cover: '',
  summary: '',
  content: '',
  tagsText: '',
  isTop: false,
  status: 'published',
  publishedAt: todayInput()
})

const form = reactive(blankForm())

function toDateInput(value) {
  if (!value) return todayInput()
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return todayInput()
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function openForm(row = null) {
  Object.assign(form, blankForm())
  if (row) {
    Object.assign(form, {
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category || '兰文化',
      author: row.author || '九畹编辑部',
      cover: row.cover || '',
      summary: row.summary || '',
      content: row.content || '',
      tagsText: (row.tags || []).join(', '),
      isTop: !!row.isTop,
      status: row.status,
      publishedAt: toDateInput(row.publishedAt)
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
  if (!form.title.trim()) return toast('请填写文章标题')

  const payload = {
    title: form.title,
    slug: form.slug,
    category: form.category,
    author: form.author,
    cover: form.cover,
    summary: form.summary,
    content: form.content,
    tags: splitList(form.tagsText),
    isTop: form.isTop,
    status: form.status,
    publishedAt: form.publishedAt
  }

  saving.value = true
  try {
    if (form.id) {
      await $fetch(`/api/admin/articles/${form.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/admin/articles', { method: 'POST', body: payload })
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
    await showConfirmDialog({ title: '删除文章', message: `确定删除「${row.title}」吗？` })
  } catch {
    return
  }

  try {
    await $fetch(`/api/admin/articles/${row.id}`, { method: 'DELETE' })
    toast('已删除', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  }
}

useHead({ title: '文章管理' })
</script>
