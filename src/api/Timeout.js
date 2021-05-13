import axios from '../http'
const url = window.AQES.DOMAIN + '/api/timeout' + `?authKey=${window.AQES.authKey}`

// 时间获取
export const TimeoutAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}

// 时间获取
export const TimeoutSetApi = (payload = {}) => {
  payload.cmd = 'set'
  return axios.post(url, JSON.stringify(payload))
}