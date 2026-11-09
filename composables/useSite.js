/**
 * 站点配置（由 app.vue 统一注入）
 */
export function useSite() {
  return useState('site', () => ({}))
}
