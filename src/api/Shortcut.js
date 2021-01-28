import axios from '../http'
const url = window.AQES.DOMAIN + '/api/shortcut'
// 更新
export const shortcutUpdateApi = (payload = {}) => {
  payload.cmd = 'update'
  // return axios.post(url, JSON.stringify(payload))
}

// 获取
export const shortcutGetApi = (payload = {}) => {
  payload.cmd = 'get'
  // return axios.post(url, JSON.stringify(payload))
}

// 重置
export const shortcutResetApi = (payload = {}) => {
  payload.cmd = 'reset'
  // return axios.post(url, JSON.stringify(payload))
}
