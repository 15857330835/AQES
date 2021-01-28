import { css_urls, js_urls } from './cssAndJsArr'
import define from './define'
const initRootHost = () => {
  const getScriptSrc = srcName => {
    const scripts = document.getElementsByTagName('script')
    for (let i = scripts.length - 1; i >= 0; i--) {
      const scriptSrc = scripts[i].getAttribute('src')
      if (scriptSrc.includes(srcName)) {
        return scriptSrc
      }
    }
    return ''
  }
  const getRootHost = scriptSrc => {
    if (scriptSrc === '') {
      return ''
    }
    const reg = /\/\/([^/]*?)\//
    const host = reg.exec(scriptSrc)
    const isIP = /\d+.\d+.\d+.\d+:\d+/.test(host)
    if (!host || host.length < 2 || isIP) {
      return ''
    }
    const splitArr = host[1].split('.')
    const len = splitArr.length
    if (len < 2) {
      console.log(splitArr)
      return ''
    } else {
      return `${splitArr[len - 2]}.${splitArr[len - 1]}`
    }
  }
  window.appointConfig = {
    ROOT_HOST: getRootHost(getScriptSrc('comment.js')) || 'aodianyun.com',
    STATIC_PROTOCOL: /https/i.test(window.location.href) ? 'https:' : 'http:'
  }
}
initRootHost()
export default class lcps {
  constructor() {}
  Config(options) {
    for (var key in options) {
      this[key] = options[key]
    }
  }
  Init() {
    define.js(js_urls, function() {})
    define.css(css_urls, function() {})
  }
}
