import axios from '../http'
const url = window.AQES.DOMAIN + '/api/track'
// ALL
export const trackAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}
// 删除
export const trackDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 属性Set
export const trackPropertySetApi = (payload = {}) => {
  payload.cmd = 'property_set'
  return axios.post(url, JSON.stringify(payload))
}
// 属性追加
export const trackPropertyAppendApi = (payload = {}) => {
  payload.cmd = 'property_append'
  return axios.post(url, JSON.stringify(payload))
}
// 显示
export const trackShowApi = (payload = {}) => {
  payload.cmd = 'show'
  return axios.post(url, JSON.stringify(payload))
}
// 添加
export const trackAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}
// 移动
export const trackMoveApi = (payload = {}) => {
  payload.cmd = 'move'
  return axios.post(url, JSON.stringify(payload))
}
// 置底
export const trackBottomApi = (payload = {}) => {
  payload.cmd = 'bottom'
  return axios.post(url, JSON.stringify(payload))
}
// 置顶
export const trackTopApi = (payload = {}) => {
  payload.cmd = 'top'
  return axios.post(url, JSON.stringify(payload))
}
// 获取
export const trackGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
// 解锁
export const trackUnlockApi = (payload = {}) => {
  payload.cmd = 'unlock'
  return axios.post(url, JSON.stringify(payload))
}
// 轨道图片获取
export const trackGetImgsApi = (payload = {}) => {
  payload.cmd = 'get_imgs'
  return axios.post(url, JSON.stringify(payload))
}
// 重命名
export const trackRenameApi = (payload = {}) => {
  payload.cmd = 'rename'
  return axios.post(url, JSON.stringify(payload))
}
// 锁定
export const trackLockApi = (payload = {}) => {
  payload.cmd = 'lock'
  return axios.post(url, JSON.stringify(payload))
}
// 隐藏
export const trackHiddenApi = (payload = {}) => {
  payload.cmd = 'hidden'
  return axios.post(url, JSON.stringify(payload))
}
// 音量
export const trackVolumeApi = (payload = {}) => {
  payload.cmd = 'volume'
  return axios.post(url, JSON.stringify(payload))
}
