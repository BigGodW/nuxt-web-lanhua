import { showToast } from 'vant'

export function toast(message, type = 'text') {
  if (import.meta.server) return
  showToast({ message, type, duration: 1800 })
}

export function errorMessage(error, fallback = '操作失败，请稍后再试') {
  return error?.data?.message || error?.message || fallback
}
