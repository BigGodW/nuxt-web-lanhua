export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss'],

  // 组件按文件名注册，便于在页面中直接使用 <SiteHeader /> <OrchidCard />
  components: [{ path: '~/components', pathPrefix: false }],

  // vant 先加载，Tailwind 的原子类可以覆盖组件默认样式
  css: ['vant/lib/index.css', '~/assets/css/main.css'],

  runtimeConfig: {
    // 仅服务端可读，务必通过环境变量覆盖
    authSecret: process.env.NUXT_AUTH_SECRET || 'jiu-wan-dev-secret',

    // 七牛云（私有配置只在服务端使用）
    qiniuAccessKey: process.env.NUXT_QINIU_ACCESS_KEY || '',
    qiniuSecretKey: process.env.NUXT_QINIU_SECRET_KEY || '',
    qiniuBucket: process.env.NUXT_QINIU_BUCKET || '',
    qiniuRegion: process.env.NUXT_QINIU_REGION || 'z0',
    qiniuCdnDomain: process.env.NUXT_QINIU_CDN_DOMAIN || '',

    public: {
      siteName: '九畹',
      // 站点线上地址，用于分享链接 / 海报二维码 / og:image
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      // 图片 CDN 域名，前端据此拼接裁剪参数
      qiniuCdnDomain: process.env.NUXT_PUBLIC_QINIU_CDN_DOMAIN || ''
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      title: '九畹 · 国兰清赏',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#24382F' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  nitro: {
    compressPublicAssets: true
  },

  // 缓存策略：服务端有内存缓存，这里再让 CDN/浏览器配合
  // - 前台只读接口：CDN 缓存 60s，过期后先返回旧内容再回源（SWR）
  // - 后台与鉴权：一律 no-store，避免把登录态或后台数据缓存出去
  routeRules: {
    '/api/admin/**': { headers: { 'cache-control': 'no-store' } },
    '/api/auth/**': { headers: { 'cache-control': 'no-store' } },
    '/api/image-proxy': { headers: { 'cache-control': 'public, max-age=86400, s-maxage=604800' } },
    '/api/qrcode': { headers: { 'cache-control': 'public, max-age=3600, s-maxage=86400' } },
    '/api/**': {
      headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' }
    },
    '/admin/**': { headers: { 'cache-control': 'no-store' } },
    '/': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    '/orchids/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    '/articles/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    '/categories/**': { headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } },
    '/about': { headers: { 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' } }
  },

  experimental: {
    payloadExtraction: false
  }
})
