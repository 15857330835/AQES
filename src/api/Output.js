import axios from '../http'
const url = window.AQES.DOMAIN + '/api/output'

// All
export const outputAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}

// 分页获取
export const outputGetListApi = (payload = {}) => {
  payload.cmd = 'get_list'
  return axios.post(url, JSON.stringify(payload))
}

// 删除
export const outputDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}

// 添加
export const outputAddApi = (payload = {}) => {
  payload.cmd = 'run'
  return axios.post(url, JSON.stringify(payload))
}

// 获取
export const outputGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
