import axios from '../http'
// const qs = require('qs')
const url = window.NCES.DOMAIN + '/upload'

// 停止
export const uploadForm = (payload = {}) => {
  return axios.post(url, payload)
}
