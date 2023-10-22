export function formatDateTime(date_str, tz) {
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
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function formatPhoneNumber(phoneNumberString) {
  let cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  let match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    let code = match[1] === '8' ? '8' : '+' + match[1]
    return code + ' (' + match[2] + ') ' + match[3] + '-' + match[4]
  }
  return null
}

export function getDaysAmount(date_start, date_end) {
  let days_amount = Math.floor((date_end.getTime() - date_start.getTime()) / (1000 * 3600 * 24))
  return days_amount !== 0 ? days_amount : 1
}
