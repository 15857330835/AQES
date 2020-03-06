import axios from 'axios'

axios.defaults.timeout = 1000 * 10
axios.defaults.withCredentials = false

axios.interceptors.response.use(
  response => {
    // Do something before response is sent
    // console.log(response);
    const res = response.data
    return res
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axios
