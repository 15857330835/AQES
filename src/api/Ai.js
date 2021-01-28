import axios from '../http'
const url = window.AQES.DOMAIN + '/api/ai'

// 停止
export const aiStopApi = (payload = {}) => {
  payload.cmd = 'stop'
  return axios.post(url, JSON.stringify(payload))
}

// 列表
export const aiListApi = (payload = {}) => {
  payload.cmd = 'list'
  return axios.post(url, JSON.stringify(payload))
}

// 启用
export const aiApplyApi = (payload = {}) => {
  payload.cmd = 'apply'
  return axios.post(url, JSON.stringify(payload))
}

// 模块状态
export const aiStatusApi = (payload = {}) => {
  payload.cmd = 'status'
  return axios.post(url, JSON.stringify(payload))
}

// 重置状态
export const aiResetApi = (payload = {}) => {
  payload.cmd = 'reset'
  return axios.post(url, JSON.stringify(payload))
}
