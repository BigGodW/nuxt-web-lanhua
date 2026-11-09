<template>
  <div class="space-y-5">
    <AdminCard title="站点信息" hint="修改后前台即时生效">
      <template #action>
        <button class="admin-btn" :disabled="saving" @click="save">
          {{ saving ? '保存中…' : '保存设置' }}
        </button>
      </template>

      <div class="space-y-8">
        <div v-for="group in groups" :key="group.title">
          <div class="mb-4 flex items-center gap-2">
            <span class="h-3 w-px bg-cinnabar" />
            <p class="font-song text-[13px] tracking-[0.12em] text-jade-deep">{{ group.title }}</p>
            <span v-if="group.hint" class="text-[11px] text-ink-light">{{ group.hint }}</span>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="field in group.fields" :key="field.key" :class="field.wide ? 'md:col-span-2' : ''">
              <label class="admin-label">{{ field.label }}</label>
              <textarea
                v-if="field.type === 'textarea'"
                v-model="form[field.key]"
                class="admin-textarea"
                :rows="field.rows || 3"
                :placeholder="field.placeholder || ''"
              />
              <input v-else v-model="form[field.key]" class="admin-input" :placeholder="field.placeholder || ''" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end border-t border-[#E3DBC9] pt-4">
        <button class="admin-btn" :disabled="saving" @click="save">{{ saving ? '保存中…' : '保存设置' }}</button>
      </div>
    </AdminCard>

    <AdminCard title="账号安全" hint="建议定期更换密码">
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="admin-label">原密码</label>
          <input v-model="password.oldPassword" type="password" class="admin-input" autocomplete="current-password" />
        </div>
        <div>
          <label class="admin-label">新密码</label>
          <input v-model="password.newPassword" type="password" class="admin-input" autocomplete="new-password" />
        </div>
        <div>
          <label class="admin-label">确认新密码</label>
          <input v-model="password.confirmPassword" type="password" class="admin-input" autocomplete="new-password" />
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <p class="text-[11px] text-ink-light">当前登录：{{ user?.nickname || user?.username }}</p>
        <button class="admin-btn" :disabled="changing" @click="changePassword">
          {{ changing ? '提交中…' : '修改密码' }}
        </button>
      </div>
    </AdminCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' })

const site = useSite()
const { user } = useAdmin()

const groups = [
  {
    title: '基础信息',
    hint: '站点名称与 SEO',
    fields: [
      { key: 'siteName', label: '站点简称', placeholder: '九畹' },
      { key: 'siteFullName', label: '站点全称', placeholder: '九畹 · 国兰清赏' },
      { key: 'slogan', label: '标语', placeholder: '一茎一花，香远益清' },
      { key: 'keywords', label: '关键词（逗号分隔）', placeholder: '国兰,春兰,蕙兰' },
      {
        key: 'description',
        label: '站点描述',
        type: 'textarea',
        wide: true,
        rows: 3,
        placeholder: '用于搜索引擎描述与页脚简介'
      }
    ]
  },
  {
    title: '关于与数据',
    hint: '首页与关于页展示',
    fields: [
      { key: 'about', label: '关于九畹', type: 'textarea', wide: true, rows: 4 },
      { key: 'statYears', label: '莳兰年数', placeholder: '20' },
      { key: 'statVarieties', label: '收录品种数（展示用）', placeholder: '120' },
      { key: 'statArticles', label: '兰文篇数（展示用）', placeholder: '80' }
    ]
  },
  {
    title: '分享与开放',
    hint: '公众号 AppID 用于微信分享卡片，未填写时前端自动降级为右上角引导',
    fields: [
      {
        key: 'siteUrl',
        label: '站点线上地址',
        wide: true,
        placeholder: 'https://www.example.com（用于分享链接与海报二维码）'
      },
      { key: 'wechatAppId', label: '公众号 AppID', placeholder: 'wx...' },
      { key: 'wechatAppSecret', label: '公众号 AppSecret', placeholder: '不填写则关闭 JS-SDK 分享' }
    ]
  },
  {
    title: '联系方式',
    fields: [
      { key: 'contactPerson', label: '联系人 / 编辑部' },
      { key: 'phone', label: '联系电话' },
      { key: 'email', label: '邮箱' },
      { key: 'wechat', label: '微信号' },
      { key: 'address', label: '地址', wide: true }
    ]
  },
  {
    title: '页脚与备案',
    fields: [
      { key: 'icp', label: 'ICP 备案号' },
      { key: 'copyright', label: '版权信息' },
      { key: 'footerNote', label: '页脚说明', type: 'textarea', wide: true, rows: 2 }
    ]
  }
]

const { data: settings, refresh } = await useFetch('/api/settings', { key: 'admin-settings' })

const form = reactive({
  siteName: '',
  siteFullName: '',
  slogan: '',
  keywords: '',
  description: '',
  about: '',
  statYears: '',
  statVarieties: '',
  statArticles: '',
  contactPerson: '',
  phone: '',
  email: '',
  wechat: '',
  address: '',
  icp: '',
  copyright: '',
  footerNote: '',
  siteUrl: '',
  wechatAppId: '',
  wechatAppSecret: ''
})

if (settings.value) {
  Object.keys(form).forEach((key) => {
    if (settings.value[key] !== undefined) form[key] = settings.value[key]
  })
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: { ...form } })
    Object.assign(site.value, form)
    toast('站点信息已保存', 'success')
    await refresh()
  } catch (error) {
    toast(errorMessage(error))
  } finally {
    saving.value = false
  }
}

/* -------------------- 修改密码 -------------------- */

const password = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const changing = ref(false)

async function changePassword() {
  if (!password.oldPassword || !password.newPassword) return toast('请填写原密码与新密码')
  if (password.newPassword.length < 6) return toast('新密码至少 6 位')
  if (password.newPassword !== password.confirmPassword) return toast('两次输入的新密码不一致')

  changing.value = true
  try {
    await $fetch('/api/admin/password', {
      method: 'PUT',
      body: { oldPassword: password.oldPassword, newPassword: password.newPassword }
    })
    password.oldPassword = ''
    password.newPassword = ''
    password.confirmPassword = ''
    toast('密码已更新', 'success')
  } catch (error) {
    toast(errorMessage(error))
  } finally {
    changing.value = false
  }
}

useHead({ title: '站点设置' })
</script>
