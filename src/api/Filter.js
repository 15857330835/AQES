import axios from '../http'
const url = window.NCES.DOMAIN + '/api/filter'

// 列表获取
export const chunkAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}
