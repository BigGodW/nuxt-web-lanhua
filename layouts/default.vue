<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    <!-- 手机端底部标签栏（桌面隐藏） -->
    <MobileTabBar />
  </div>
</template>
