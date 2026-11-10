<template>
  <div class="grid min-h-screen bg-paper lg:grid-cols-2">
    <!-- 左侧意境 -->
    <div class="relative hidden overflow-hidden bg-jade-deep lg:flex lg:flex-col lg:justify-between lg:p-14">
      <div class="absolute inset-0 opacity-40 bg-paper-grain" />
      <span class="pointer-events-none absolute -right-6 top-1/3 font-song text-[240px] leading-none text-paper/[0.05]">
        蘭
      </span>

      <div class="relative flex items-center gap-3">
        <span class="seal h-11 w-11 text-lg">兰</span>
        <div>
          <p class="font-song text-xl tracking-[0.3em] text-paper">蜀杨兰园</p>
          <p class="mt-1 text-[9px] tracking-[0.3em] text-gold-light/50">GUOLAN · ORCHID</p>
        </div>
      </div>

      <div class="relative">
        <p class="text-[10px] tracking-[0.45em] text-gold-light/60">CONTENT CONSOLE</p>
        <p class="mt-6 font-song text-[30px] leading-[1.9] tracking-[0.16em] text-paper/90">
          养兰如养心，<br />急不得，也躁不得。
        </p>
        <div class="mt-8 h-px w-20 bg-gold/40" />
        <p class="mt-5 max-w-xs text-[12px] leading-7 text-paper/45">
          在这里管理品种、品类、文章、轮播与站点信息，前台内容即时更新。
        </p>
      </div>

      <p class="relative text-[10px] tracking-[0.2em] text-paper/25">© 2026 蜀杨兰园 · 国兰清赏</p>
    </div>

    <!-- 右侧表单 -->
    <div class="flex flex-col justify-center px-6 py-12 md:px-14">
      <div class="mx-auto w-full max-w-sm">
        <div class="flex items-center gap-3 lg:hidden">
          <span class="seal h-10 w-10 text-base">兰</span>
          <div>
            <p class="font-song text-lg tracking-[0.28em] text-jade-deep">蜀杨兰园</p>
            <p class="mt-1 text-[9px] tracking-[0.28em] text-gold-deep/60">ADMIN CONSOLE</p>
          </div>
        </div>

        <p class="mt-10 text-[10px] tracking-[0.4em] text-gold-deep/70 lg:mt-0">ADMIN LOGIN</p>
        <h1 class="mt-3 font-song text-[26px] tracking-[0.15em] text-jade-deep">登录管理后台</h1>
        <p class="mt-3 text-[12px] leading-6 text-ink-light">请使用管理员账号登录，管理兰谱与站点内容。</p>

        <form class="mt-8 space-y-5" @submit.prevent="submit">
          <div>
            <label class="admin-label">账号 <em>*</em></label>
            <input
              v-model="form.username"
              class="admin-input"
              type="text"
              autocomplete="username"
              placeholder="请输入管理员账号"
            />
          </div>

          <div>
            <label class="admin-label">密码 <em>*</em></label>
            <input
              v-model="form.password"
              class="admin-input"
              type="password"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
          </div>

          <button type="submit" class="admin-btn w-full justify-center py-2.5" :disabled="loading">
            {{ loading ? '登录中…' : '登 录' }}
          </button>
        </form>

        

        <NuxtLink to="/" class="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.15em] text-ink-light hover:text-jade-deep">
          <van-icon name="arrow-left" size="11" />
          返回网站首页
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const route = useRoute()
const { login } = useAdmin()

const form = reactive({ username: '', password: '' })
const loading = ref(false)

async function submit() {
  if (!form.username.trim() || !form.password) {
    toast('请输入账号与密码')
    return
  }

  loading.value = true
  try {
    await login({ username: form.username.trim(), password: form.password })
    toast('登录成功', 'success')
    await navigateTo(route.query.redirect || '/admin')
  } catch (error) {
    toast(errorMessage(error, '登录失败'))
  } finally {
    loading.value = false
  }
}

useHead({ title: '登录后台' })
</script>
