import axios from '../http'
const url = window.AQES.DOMAIN + '/api/transition'
// 列表获取
export const transitionAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}
// 删除
export const transitionDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}

// 更新
export const transitionUpdateApi = (payload = {}) => {
  payload.cmd = 'update'
  return axios.post(url, JSON.stringify(payload))
}

// 添加
export const transitionAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}
