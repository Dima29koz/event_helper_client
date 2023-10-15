export function formatedDate(date_str, tz) {
  let date = fixDate(date_str, tz)
  let res = date.toLocaleString('ru', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  return res
}

export function fixDate(date_str, tz) {
  let date = new Date(date_str)
  // date.setHours(date.getHours() - date.getTimezoneOffset() / 60)
  return date
}

export function getNumberFormat(value) {
  if (value === null) {
    return null
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
