export function formatDate(value, withDay = true) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return withDay ? `${year}.${month}.${day}` : `${year}.${month}`
}

export function formatNumber(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

const CN_NUM = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾']

export function cnNumber(index) {
  return CN_NUM[index] || String(index + 1)
}
