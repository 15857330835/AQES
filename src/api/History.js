import axios from '../http'
const url = window.NCES.DOMAIN + '/api/history'

// 列表
export const historyListApi = (payload = {}) => {
  payload.cmd = 'list'
  return axios.post(url, JSON.stringify(payload))
}

// 前一步
export const historyLastApi = (payload = {}) => {
  payload.cmd = 'last'
  return axios.post(url, JSON.stringify(payload))
}

// 后一步
export const historyNextApi = (payload = {}) => {
  payload.cmd = 'next'
  return axios.post(url, JSON.stringify(payload))
}

// 清空
export const historyClearApi = (payload = {}) => {
  payload.cmd = 'clear'
  return axios.post(url, JSON.stringify(payload))
}

// 跳转
export const historySetApi = (payload = {}) => {
  payload.cmd = 'set'
  return axios.post(url, JSON.stringify(payload))
}
