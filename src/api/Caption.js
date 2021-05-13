import axios from '../http'

const url = window.AQES.DOMAIN + '/api/caption' + `?authKey=${window.AQES.authKey}`

// ALL
export const captionAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}

// 删除console.log\((.*)\);
export const captionDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 显示
export const captionShowApi = (payload = {}) => {
  payload.cmd = 'show'
  return axios.post(url, JSON.stringify(payload))
}
// 更新位置
export const captionMoveApi = (payload = {}) => {
  payload.cmd = 'move'
  return axios.post(url, JSON.stringify(payload))
}
// 更新字体样式
export const captionUpdateFontStyleApi = (payload = {}) => {
  payload.cmd = 'update_font_style'
  return axios.post(url, JSON.stringify(payload))
}
// 更新字体
export const captionUpdateFontApi = (payload = {}) => {
  payload.cmd = 'update_font'
  return axios.post(url, JSON.stringify(payload))
}
// 更新文本
export const captionUpdateTextApi = (payload = {}) => {
  payload.cmd = 'update_text'
  return axios.post(url, JSON.stringify(payload))
}
// 更新样式
export const captionUpdateStyleApi = (payload = {}) => {
  payload.cmd = 'update_style'
  return axios.post(url, JSON.stringify(payload))
}
// 样式列表
export const captionStyleListApi = (payload = {}) => {
  payload.cmd = 'style_list'
  return axios.post(url, JSON.stringify(payload))
}
// 添加
export const captionAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}
// 清空
export const captionClearApi = (payload = {}) => {
  payload.cmd = 'claer'
  return axios.post(url, JSON.stringify(payload))
}
// 解锁
export const captionUnlockApi = (payload = {}) => {
  payload.cmd = 'unlock'
  return axios.post(url, JSON.stringify(payload))
}
// 锁定
export const captionLockApi = (payload = {}) => {
  payload.cmd = 'lock'
  return axios.post(url, JSON.stringify(payload))
}
// 隐藏
export const captionHiddenApi = (payload = {}) => {
  payload.cmd = 'hidden'
  return axios.post(url, JSON.stringify(payload))
}

// 获取字幕路径
export const captionFileOutApi = (payload = {}) => {
  payload.cmd = 'file_out'
  return axios.post(url, JSON.stringify(payload))
}
