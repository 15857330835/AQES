import moment from 'moment'
import { MIN_LENGTH } from '@/config'

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

export function transGeoValue(val) {
  // let result = Math.round(val * 100) / 100
  let result = Math.round(val)
  if (result <= MIN_LENGTH) {
    result = MIN_LENGTH
  }
  return result
}

export function transGeoValue2(val) {
  // return Math.round(val * 100) / 100
  return Math.round(val)
}
