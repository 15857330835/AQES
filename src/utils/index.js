import moment from 'moment'

export function dateFormat(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
}
export const trantime = function(s) {
  let h = Math.floor(s / 1500)
  let m = Math.floor((s % 1500) / 25)
  m < 10 && (m = '0' + m)
  let s2 = parseInt(s % 25, 10)
  s2 < 10 && (s2 = '0' + s2)
  h < 10 && (h = '0' + h)
  return h + ':' + m + ':' + s2 // 00:00:00
}

export function getTimeStr(time) {
  // Time = Math.floor(Time)
  const Time = parseInt(time, 10)
  let hour = 0
  let minute = 0
  let second = 0

  second = parseInt(Time % 60, 10)
  minute = parseInt(parseInt(Time / 60, 10) % 60, 10)
  hour = parseInt(Time / 3600, 10)
  if (hour < 10) hour = '0' + hour
  let d
  if (minute < 10 && second < 10) {
    d = hour + ':0' + minute + ':0' + second
  } else if (minute < 10 && second >= 10) {
    d = hour + ':0' + minute + ':' + second
  } else if (minute >= 10 && second < 10) {
    d = hour + ':' + minute + ':0' + second
  } else if (minute >= 10 && second >= 10) {
    d = hour + ':' + minute + ':' + second
  }
  return d
}

export function deepClone(obj) {
  const newObj = obj instanceof Array ? [] : {}
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
    }
  }
  return newObj
}

/* 函数节流 */
export const Debounce = (fn, t) => {
  const delay = t || 500
  let timer
  console.log('函数防抖')
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}
/* 函数节流 */
export const Throttle = (fn, t) => {
  let last
  let timer
  console.log('函数节流')
  const interval = t || 500
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    const now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(this, args)
      }, interval)
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}
