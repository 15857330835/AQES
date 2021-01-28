import axios from '../http'
const url = window.AQES.DOMAIN + '/api/player'

// 播放器重启
export const playerRestartApi = (payload = {}) => {
  payload.cmd = 'restart'
  return axios.post(url, JSON.stringify(payload))
}
