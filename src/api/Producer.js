import axios from '../http'
const url = window.NCES.DOMAIN + '/api/producer'
// 删除
export const producerDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 添加
export const producerAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}

// 获取
export const producerGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
