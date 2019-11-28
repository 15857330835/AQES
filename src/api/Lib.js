import axios from '../http'
const url = window.NCES.DOMAIN + '/api/lib'

// 列表
export const libListApi = (payload = {}) => {
  payload.cmd = 'list'
  return axios.post(url, JSON.stringify(payload))
}

// 删除
export const libDelApi = (payload = {}) => {
  payload.cmd = 'del'
  return axios.post(url, JSON.stringify(payload))
}
// 删除文件夹
// export const libDelDirApi = (payload = {}) => {
//   payload.cmd = "del_dir";
//   return axios.post(url, JSON.stringify(payload));
// };
// 复制
export const libCopyApi = (payload = {}) => {
  payload.cmd = 'copy'
  return axios.post(url, JSON.stringify(payload))
}

// 添加文件夹
export const libAddDirApi = (payload = {}) => {
  payload.cmd = 'add_dir'
  return axios.post(url, JSON.stringify(payload))
}

// 移动
export const libMoveApi = (payload = {}) => {
  payload.cmd = 'move'
  return axios.post(url, JSON.stringify(payload))
}
// 重命名
export const libRenameApi = (payload = {}) => {
  payload.cmd = 'rename'
  return axios.post(url, JSON.stringify(payload))
}
// 移动文件夹
// export const libMoveDirApi = (payload = {}) => {
//   payload.cmd = "move_dir";
//   return axios.post(url, JSON.stringify(payload));
// };
