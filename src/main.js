import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/index.css'
import './css/chunkset.scss'
import './css/comment.scss'
import './css/ai_voice_pane.scss'
import './css/bad_props.css'
import './css/media_query.css'
import './icons/iconfont.css' // 图标文件
import store from './store/'
import App from './App.vue'
import Unable from './model/Unable.vue'
import fullscreen from 'vue-fullscreen' // 引入网页全屏插件
import axios from './http'

Vue.use(fullscreen)
Vue.use(ElementUI)
Vue.prototype.$axios = axios
const isDev = process.env.NODE_ENV !== 'production'
Vue.config.performance = isDev

const ie = window.NCES.Define()
// eslint-disable-next-line no-unused-vars
let vm
if (ie === 6 || ie === 7 || ie === 8 || ie === 9 || ie === 10) {
  vm = new Vue({
    el: '#' + window.NCES.id,
    render: h => h(Unable)
  })
} else {
  vm = new Vue({
    el: '#' + window.NCES.id,
    store,
    render: h => h(App)
  })
}
