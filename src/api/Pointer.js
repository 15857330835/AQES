import axios from '../http'
const url = window.AQES.DOMAIN + '/api/pointer' + `?authKey=${window.AQES.authKey}`

// 上一帧
export const pointerLastFApi = (payload = {}) => {
  payload.cmd = 'last_f'
  return axios.post(url, JSON.stringify(payload))
}

// 下一帧
export const pointerNextFApi = (payload = {}) => {
  payload.cmd = 'next_f'
  return axios.post(url, JSON.stringify(payload))
}
// 获取
export const pointerGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
// 设置
export const pointerSetApi = (payload = {}) => {
  payload.cmd = 'set'
  return axios.post(url, JSON.stringify(payload))
}
