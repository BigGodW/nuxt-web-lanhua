<template>
  <div class="min-h-screen bg-[#F4EFE3]">
    <!-- 桌面侧栏 -->
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col bg-jade-deep lg:flex">
      <NuxtLink to="/admin" class="flex items-center gap-3 px-5 py-6">
        <span class="seal h-9 w-9 text-sm">兰</span>
        <span class="leading-none">
          <span class="block font-song text-[17px] tracking-[0.25em] text-paper">九畹</span>
          <span class="mt-1.5 block text-[9px] tracking-[0.28em] text-gold-light/50">ADMIN CONSOLE</span>
        </span>
      </NuxtLink>

      <div class="mx-5 h-px bg-paper/10" />

      <AdminNav class="mt-4" />

      <div class="mt-auto px-5 py-5">
        <div class="border border-paper/10 p-3 text-[10px] leading-5 text-paper/35">
          <p>九畹 · 国兰清赏</p>
          <p>管理后台 v1.0</p>
        </div>
      </div>
    </aside>

    <div class="flex min-h-screen flex-col lg:ml-56">
      <!-- 顶栏 -->
      <header
        class="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E3DBC9] bg-paper/95 px-4 backdrop-blur md:px-7"
      >
        <div class="flex items-center gap-3">
          <button
            class="flex h-11 w-11 items-center justify-center border border-[#DCD3C0] text-jade-deep active:bg-paper-deep/60 lg:hidden"
            aria-label="打开菜单"
            @click="drawerOpen = true"
          >
            <van-icon name="bars" size="17" />
          </button>
          <div>
            <p class="font-song text-[17px] tracking-[0.12em] text-jade-deep">{{ pageTitle }}</p>
            <p class="mt-0.5 hidden text-[10px] tracking-[0.2em] text-ink-light md:block">
              JIU WAN · ORCHID CONTENT SYSTEM
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            target="_blank"
            class="hidden items-center gap-1.5 border border-[#DCD3C0] px-3 py-1.5 text-[12px] text-ink-soft transition-colors hover:border-gold hover:text-jade-deep md:flex"
          >
            <van-icon name="eye-o" size="14" />
            查看网站
          </NuxtLink>

          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-jade text-[12px] text-paper">
              {{ (user?.nickname || user?.username || '兰').slice(0, 1) }}
            </span>
            <div class="hidden leading-tight sm:block">
              <p class="text-[12px] text-ink">{{ user?.nickname || user?.username }}</p>
              <p class="text-[10px] text-ink-light">管理员</p>
            </div>
            <button
              class="ml-1 flex h-9 w-9 items-center justify-center text-ink-light transition-colors hover:text-cinnabar"
              title="退出登录"
              @click="handleLogout"
            >
              <van-icon name="revoke" size="16" />
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-5 md:px-7 md:py-7">
        <slot />
      </main>
    </div>

    <!-- 移动端侧栏 -->
    <van-popup v-model:show="drawerOpen" position="left" :style="{ width: 'min(80%, 18rem)', height: '100%' }">
      <div class="flex h-full flex-col bg-jade-deep">
        <div class="flex items-center justify-between px-5 py-6">
          <div class="flex items-center gap-3">
            <span class="seal h-9 w-9 text-sm">兰</span>
            <div>
              <p class="font-song text-[17px] tracking-[0.25em] text-paper">九畹</p>
              <p class="mt-1 text-[10px] tracking-[0.24em] text-gold-light/50">ADMIN CONSOLE</p>
            </div>
          </div>
          <button class="-mr-2 flex h-11 w-11 items-center justify-center text-paper/50" aria-label="关闭菜单" @click="drawerOpen = false">
            <van-icon name="cross" size="18" />
          </button>
        </div>
        <AdminNav @navigate="drawerOpen = false" />
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { showConfirmDialog } from 'vant'

const route = useRoute()
const { user, logout } = useAdmin()
const drawerOpen = ref(false)

const titles = {
  '/admin': '仪表盘',
  '/admin/orchids': '品种管理',
  '/admin/categories': '品类管理',
  '/admin/articles': '文章管理',
  '/admin/banners': '轮播管理',
  '/admin/settings': '站点设置'
}

const pageTitle = computed(() => titles[route.path] || '管理后台')

async function handleLogout() {
  try {
    await showConfirmDialog({ title: '退出登录', message: '确定要退出管理后台吗？' })
    await logout()
  } catch {
    /* 用户取消 */
  }
}
</script>
