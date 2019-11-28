import axios from '../http'
// 工作状态获取
export const globalAllApi = () => {
  return axios.get(window.NCES.DOMAIN + '/api/all')
}

// 系统状态获取
export const globalSystemApi = () => {
  return axios.get(window.NCES.DOMAIN + '/api/system')
}
