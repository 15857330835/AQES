import axios from '../http'
const url = window.AQES.DOMAIN + '/api/source'

// ALL
export const sourceAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}
// 临摹
export const sourceCopyApi = (payload = {}) => {
  payload.cmd = 'copy'
  return axios.post(url, JSON.stringify(payload))
}

// 分页获取
export const sourceGetListApi = (payload = {}) => {
  payload.cmd = 'get_list'
  return axios.post(url, JSON.stringify(payload))
}
// 删除
export const sourceDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 加载
export const sourceLoadApi = (payload = {}) => {
  payload.cmd = 'load'
  return axios.post(url, JSON.stringify(payload))
}
// 取消加载
export const sourceUnloadApi = (payload = {}) => {
  payload.cmd = 'unload'
  return axios.post(url, JSON.stringify(payload))
}
// 图片获取
export const sourceGetImgsApi = (payload = {}) => {
  payload.cmd = 'get_imgs'
  return axios.post(url, JSON.stringify(payload))
}
// 添加
export const sourceAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}

// 清除本地缓存
export const sourceClearApi = (payload = {}) => {
  payload.cmd = 'clear'
  return axios.post(url, JSON.stringify(payload))
}
// 获取
export const sourceGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
// 重试
export const sourceRetryApi = (payload = {}) => {
  payload.cmd = 'retry'
  return axios.post(url, JSON.stringify(payload))
}
