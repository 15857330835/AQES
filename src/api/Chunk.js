import axios from '../http'
const url = window.NCES.DOMAIN + '/api/chunk'
// All
export const chunkAllApi = (payload = {}) => {
  payload.cmd = 'all'
  return axios.post(url, JSON.stringify(payload))
}

// 删除
export const chunkDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 删除滤镜
export const chunkDelFilterApi = (payload = {}) => {
  payload.cmd = 'del_filter'
  return axios.post(url, JSON.stringify(payload))
}

// 复制
export const chunkCopyApi = (payload = {}) => {
  payload.cmd = 'copy'
  return axios.post(url, JSON.stringify(payload))
}
// 拆分
export const chunkSplitApi = (payload = {}) => {
  payload.cmd = 'split'
  return axios.post(url, JSON.stringify(payload))
}
// 更新属性
export const chunkUpdatePropertyApi = (payload = {}) => {
  payload.cmd = 'update_property'
  return axios.post(url, JSON.stringify(payload))
}
// 更新播放速度
export const chunkUpdateSpeedApi = (payload = {}) => {
  payload.cmd = 'update_speed'
  return axios.post(url, JSON.stringify(payload))
}
// 更新模板参数
export const chunkUpdateTemplateParameterApi = (payload = {}) => {
  payload.cmd = 'update_template_parameter'
  return axios.post(url, JSON.stringify(payload))
}
// 更新滤镜
export const chunkUpdateFilterApi = (payload = {}) => {
  payload.cmd = 'update_filter'
  return axios.post(url, JSON.stringify(payload))
}
// 更新范围
export const chunkUpdateLengthApi = (payload = {}) => {
  payload.cmd = 'update_length'
  return axios.post(url, JSON.stringify(payload))
}

// 替换源
export const chunkReplaceApi = (payload = {}) => {
  payload.cmd = 'replace'
  return axios.post(url, JSON.stringify(payload))
}

// 添加
export const chunkAddApi = (payload = {}) => {
  payload.cmd = 'add'
  return axios.post(url, JSON.stringify(payload))
}

// 添加滤镜
export const chunkAddFilterApi = (payload = {}) => {
  payload.cmd = 'add_filter'
  return axios.post(url, JSON.stringify(payload))
}
// 移动
export const chunkMoveApi = (payload = {}) => {
  payload.cmd = 'move'
  return axios.post(url, JSON.stringify(payload))
}
// 移动滤镜图层
export const chunkMoveFilterApi = (payload = {}) => {
  payload.cmd = 'move_filter'
  return axios.post(url, JSON.stringify(payload))
}
// 获取
export const chunkGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}
// 音频分离
export const chunkSeparateAudioApi = (payload = {}) => {
  payload.cmd = 'separate_audio'
  return axios.post(url, JSON.stringify(payload))
}
