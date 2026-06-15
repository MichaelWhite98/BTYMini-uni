const pad = (value) => String(value).padStart(2, '0')

export const formatDate = (date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

export const formatTime = (date) => {
  const value = new Date(date)
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`
}

export const formatDateTime = (date) => `${formatDate(date)} ${formatTime(date)}`

export const getToday = () => formatDate(new Date())

export const getMonthDays = (year, month) => new Date(year, month, 0).getDate()

export const getMonthKey = (date) => {
  const value = new Date(date)
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}`
}

export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-')
  return `${Number(year)}年${Number(month)}月`
}

export const shiftMonthKey = (monthKey, delta) => {
  const [year, month] = monthKey.split('-').map(Number)
  const next = new Date(year, month - 1 + delta, 1)
  return getMonthKey(next)
}

export const formatChineseDay = (date) => {
  const value = new Date(date)
  const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${weekMap[value.getDay()]}，${value.getMonth() + 1}月${value.getDate()}日`
}

export const buildRecordStamp = (record) => {
  return `${record.date || ''} ${record.time || '00:00'}`
}

