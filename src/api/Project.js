import axios from '../http'
const url = window.AQES.DOMAIN + '/api/project'
// 保存
export const projectSaveApi = (payload = {}) => {
  payload.cmd = 'save'
  return axios.post(url, JSON.stringify(payload))
}

// 删除
export const projectDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}

// 加载
// export const projectLoNCES.DOMAIN + "/api" = (payload = {}) => {
//   payload.cmd = "load";
//   return axios.post(url, JSON.stringify(payload));
// };
export const projectLoadApi = (payload = {}) => {
  payload.cmd = 'load'
  return axios.post(url, JSON.stringify(payload))
}

// 另存为
export const projectSaveAsApi = (payload = {}) => {
  payload.cmd = 'saveas'
  return axios.post(url, JSON.stringify(payload))
}

// 当前工程信息
export const projectInfoApi = (payload = {}) => {
  payload.cmd = 'info'
  return axios.post(url, JSON.stringify(payload))
}

// 当前的
export const projectCurrentApi = (payload = {}) => {
  payload.cmd = 'current'
  return axios.post(url, JSON.stringify(payload))
}

// 搜索
export const projectSearchApi = (payload = {}) => {
  payload.cmd = 'search'
  return axios.post(url, JSON.stringify(payload))
}

// 获取
export const projectGetApi = (payload = {}) => {
  payload.cmd = 'get'
  return axios.post(url, JSON.stringify(payload))
}

// 重命名
export const projectRenameApi = (payload = {}) => {
  payload.cmd = 'rename'
  return axios.post(url, JSON.stringify(payload))
}
