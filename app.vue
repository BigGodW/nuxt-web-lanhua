<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const site = useState('site', () => ({}))

const { data } = await useFetch('/api/settings', {
  key: 'site-settings',
  default: () => ({})
})

site.value = data.value || {}

useHead(() => ({
  titleTemplate: (title) =>
    title ? `${title} · ${site.value.siteName || '九畹'}` : site.value.siteFullName || '九畹 · 国兰清赏',
  meta: [
    { name: 'description', content: site.value.description || '国兰品种鉴赏与养护知识' },
    { name: 'keywords', content: site.value.keywords || '国兰,兰花' },
    { property: 'og:site_name', content: site.value.siteFullName || '九畹 · 国兰清赏' },
    { property: 'og:locale', content: 'zh_CN' },
    { name: 'applicable-device', content: 'pc,mobile' }
  ]
}))
</script>
